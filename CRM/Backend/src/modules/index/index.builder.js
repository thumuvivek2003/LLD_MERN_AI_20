import { indexStrategyFactory } from './strategies/index-strategy.registry.js';
import { fieldTypeRegistry } from '../field/types/field-type.registry.js';
import { INDEX_STATUS, EVENT_TYPE, RECORD_STATUS } from '../../config/constants.js';

/**
 * IndexBuilder — materialises index structures from the record store.
 *
 * Split out of IndexManager because the two change for different reasons: the
 * manager owns *which indexes exist and how they are queried*, the builder owns
 * *how records become index entries*. Adding a build mode (incremental
 * re-materialisation, partial rebuild) touches only this file.
 */
export class IndexBuilder {
  constructor({ indexRepository, indexEntryRepository, recordRepository, eventBus }) {
    this.indexRepository = indexRepository;
    this.indexEntryRepository = indexEntryRepository;
    this.recordRepository = recordRepository;
    this.eventBus = eventBus;
  }

  /** Build one index. @returns {{def, strategy, field}} */
  async buildOne({ def, field, objectLabel }) {
    const started = process.hrtime.bigint();
    this.eventBus.publish(EVENT_TYPE.INDEX_BUILD_STARTED, {
      indexId: def.indexId,
      objectId: def.objectId,
      objectLabel,
      fieldId: def.fieldId,
    });
    await this.indexRepository.updateByIndexId(def.indexId, { $set: { status: INDEX_STATUS.BUILDING } });

    const descriptor = fieldTypeRegistry.get(field.type);
    const pairs = [];
    const cursor = this.recordRepository.cursorByObject(def.objectId, RECORD_STATUS.ACTIVE);
    for await (const record of cursor) {
      pairs.push({ keys: descriptor.indexKeys(record.recordJson?.[def.fieldId]), recordId: record.recordId });
    }

    const strategy = indexStrategyFactory.create(def.type, field);
    strategy.build(pairs);
    const patched = await this.#persist({ def, strategy, docCount: pairs.length, started, objectLabel });
    return { def: patched, strategy, field };
  }

  /**
   * Build every index of one object in a SINGLE pass over its records.
   * Building them one at a time would re-read the same 4 000 documents once per
   * index; this reads them once and feeds all strategies.
   */
  async buildMany({ objectDef, targets }) {
    if (!targets.length) return [];

    const prepared = targets.map(({ def, field }) => ({
      def,
      field,
      descriptor: fieldTypeRegistry.get(field.type),
      strategy: indexStrategyFactory.create(def.type, field),
      pairs: [],
    }));

    const scanStart = process.hrtime.bigint();
    let docCount = 0;
    const cursor = this.recordRepository.cursorByObject(objectDef.objectId, RECORD_STATUS.ACTIVE);
    for await (const record of cursor) {
      docCount += 1;
      for (const t of prepared) {
        t.pairs.push({ keys: t.descriptor.indexKeys(record.recordJson?.[t.field.fieldId]), recordId: record.recordId });
      }
    }
    const scanMs = Math.round(Number(process.hrtime.bigint() - scanStart) / 1e6);

    const out = [];
    for (const t of prepared) {
      const started = process.hrtime.bigint();
      t.strategy.build(t.pairs);
      const patched = await this.#persist({
        def: t.def,
        strategy: t.strategy,
        docCount,
        started,
        extraMs: scanMs,
        objectLabel: objectDef.label,
      });
      out.push({ def: patched, strategy: t.strategy, field: t.field });
    }
    return out;
  }

  async markFailed(indexId) {
    return this.indexRepository.updateByIndexId(indexId, { $set: { status: INDEX_STATUS.FAILED, health: 0 } });
  }

  async #persist({ def, strategy, docCount, started, extraMs = 0, objectLabel }) {
    const rows = strategy.serialize().map((row) => ({
      indexId: def.indexId,
      objectId: def.objectId,
      fieldId: def.fieldId,
      key: row.key,
      recordIds: row.recordIds,
    }));
    await this.indexEntryRepository.replaceForIndex(def.indexId, rows);

    const buildMs = Math.round(Number(process.hrtime.bigint() - started) / 1e6) + extraMs;
    const stats = strategy.stats();
    const patched = await this.indexRepository.updateByIndexId(def.indexId, {
      $set: {
        status: INDEX_STATUS.ACTIVE,
        docCount,
        keyCount: stats.keys,
        sizeBytes: IndexBuilder.estimateBytes(rows),
        health: 100,
        lastBuiltAt: new Date(),
        buildMs,
      },
      $push: { history: { at: new Date(), action: 'BUILD', docCount, ms: buildMs } },
    });

    this.eventBus.publish(EVENT_TYPE.INDEX_BUILD_COMPLETED, {
      indexId: def.indexId,
      objectId: def.objectId,
      objectLabel,
      fieldId: def.fieldId,
      docCount,
      buildMs,
    });
    return patched;
  }

  static estimateBytes(rows) {
    let bytes = 0;
    for (const row of rows) bytes += Buffer.byteLength(row.key, 'utf8') + row.recordIds.length * 28 + 40;
    return bytes;
  }
}
