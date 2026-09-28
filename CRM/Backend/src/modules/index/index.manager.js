import { indexStrategyFactory } from './strategies/index-strategy.registry.js';
import { fieldTypeRegistry } from '../field/types/field-type.registry.js';
import { IndexBuilder } from './index.builder.js';
import { indexId as newIndexId } from '../../core/utils/id.util.js';
import { INDEX_STATUS, EVENT_TYPE } from '../../config/constants.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';
import { logger } from '../../core/utils/logger.util.js';

/**
 * IndexManager — the registry of live indexes and the query path into them.
 *
 * Durability lives in Mongo (`indexentries`), the query path lives in RAM.
 * The manager is the only component that knows both; everything above it (the
 * Query Engine) just asks `query(objectId, fieldId, operator, value)` and gets
 * record ids back, with no idea which structure answered.
 *
 * Materialising entries from records is delegated to IndexBuilder.
 */
export class IndexManager {
  constructor({ indexRepository, indexEntryRepository, recordRepository, metadataCache, eventBus }) {
    this.indexRepository = indexRepository;
    this.indexEntryRepository = indexEntryRepository;
    this.metadataCache = metadataCache;
    this.eventBus = eventBus;
    this.builder = new IndexBuilder({ indexRepository, indexEntryRepository, recordRepository, eventBus });

    this.live = new Map(); // indexId -> { def, strategy, field }
    this.byField = new Map(); // `${objectId}:${fieldId}` -> indexId
    this.queryStats = new Map(); // indexId -> { count, totalMs, hits, misses }
  }

  static key(objectId, fieldId) {
    return `${objectId}:${fieldId}`;
  }

  // ---------------------------------------------------------------- bootstrap

  /** Mirror every persisted index into memory. Called once at boot. */
  async loadAll() {
    const defs = await this.indexRepository.findAll();
    let loaded = 0;
    for (const def of defs) {
      const field = await this.#fieldFor(def.objectId, def.fieldId);
      if (!field) continue;
      const strategy = indexStrategyFactory.create(def.type, field);
      strategy.load(await this.indexEntryRepository.findByIndexId(def.indexId));
      this.#install({ def, strategy, field });
      loaded += 1;
    }
    logger.info(`Index layer warm: ${loaded} indexes mirrored in memory`, null, 'index-manager');
    return loaded;
  }

  #install({ def, strategy, field }) {
    this.live.set(def.indexId, { def, strategy, field });
    this.byField.set(IndexManager.key(def.objectId, def.fieldId), def.indexId);
  }

  async #fieldFor(objectId, fieldId) {
    const objectDef = await this.metadataCache.getObject(objectId);
    return objectDef?.fields?.find((f) => f.fieldId === fieldId) || null;
  }

  // ------------------------------------------------------------- definitions

  getIndexFor(objectId, fieldId) {
    const indexId = this.byField.get(IndexManager.key(objectId, fieldId));
    return indexId ? this.live.get(indexId) : null;
  }

  hasIndex(objectId, fieldId) {
    const entry = this.getIndexFor(objectId, fieldId);
    return Boolean(entry && entry.def.status === INDEX_STATUS.ACTIVE);
  }

  listLive() {
    return [...this.live.values()];
  }

  /** Create the definition if absent; returns the (possibly existing) definition. */
  async ensureIndex(objectId, fieldId, explicitType = null) {
    const existing = await this.indexRepository.findByField(objectId, fieldId);
    if (existing) return existing;

    const objectDef = await this.metadataCache.getObject(objectId);
    if (!objectDef) throw new NotFoundError('Object', objectId);
    const field = objectDef.fields.find((f) => f.fieldId === fieldId);
    if (!field) throw new NotFoundError('Field', fieldId);

    const type = explicitType || fieldTypeRegistry.indexTypeFor(field.type);
    const created = await this.indexRepository.create({
      indexId: newIndexId(),
      name: `idx_${objectId}_${field.apiName}`,
      objectId,
      fieldId,
      type,
      status: INDEX_STATUS.INACTIVE,
    });
    const def = created.toObject ? created.toObject() : created;
    this.#install({ def, strategy: indexStrategyFactory.create(type, field), field });
    return def;
  }

  // ------------------------------------------------------------------- build

  async build(indexId) {
    const entry = this.live.get(indexId) || (await this.#hydrate(indexId));
    if (!entry) throw new NotFoundError('Index', indexId);
    const objectDef = await this.metadataCache.getObject(entry.def.objectId);
    const field = (await this.#fieldFor(entry.def.objectId, entry.def.fieldId)) || entry.field;

    try {
      const built = await this.builder.buildOne({ def: entry.def, field, objectLabel: objectDef?.label });
      this.#install(built);
      return built.def;
    } catch (err) {
      await this.builder.markFailed(indexId);
      logger.error(`Index build failed for ${indexId}: ${err.message}`, null, 'index-manager');
      throw err;
    }
  }

  /** Build every index an object's field metadata implies, in one record pass. */
  async buildForObject(objectId) {
    const objectDef = await this.metadataCache.getObject(objectId);
    if (!objectDef) return [];

    const targets = [];
    for (const field of objectDef.fields) {
      if (!field.indexed) continue;
      targets.push({ def: await this.ensureIndex(objectId, field.fieldId), field });
    }
    const built = await this.builder.buildMany({ objectDef, targets });
    for (const item of built) this.#install(item);
    return built.map((b) => b.def);
  }

  async rebuildAll(objectId = null) {
    const defs = await this.indexRepository.findAll(objectId ? { objectId } : {});
    const results = [];
    for (const def of defs) {
      results.push(await this.build(def.indexId).catch((e) => ({ indexId: def.indexId, error: e.message })));
    }
    return results;
  }

  async drop(indexId) {
    const entry = this.live.get(indexId);
    await this.indexEntryRepository.deleteForIndex(indexId);
    const def = await this.indexRepository.deleteByIndexId(indexId);
    if (!def && !entry) throw new NotFoundError('Index', indexId);
    this.live.delete(indexId);
    if (def) this.byField.delete(IndexManager.key(def.objectId, def.fieldId));
    this.eventBus.publish(EVENT_TYPE.INDEX_DELETED, { indexId, objectId: def?.objectId, fieldId: def?.fieldId });
    return def;
  }

  // ------------------------------------------------------- incremental upkeep

  /**
   * Keep every index for an object in step with one record mutation.
   * Memory is updated synchronously (so the next query is correct);
   * Mongo is updated in the background (so the write stays fast).
   */
  async applyRecordChange({ objectId, recordId, before = null, after = null }) {
    const objectDef = await this.metadataCache.getObject(objectId);
    if (!objectDef) return;

    const ops = [];
    let touched = 0;
    for (const field of objectDef.fields) {
      const entry = this.getIndexFor(objectId, field.fieldId);
      if (!entry) continue;
      const descriptor = fieldTypeRegistry.get(field.type);
      const oldKeys = before ? descriptor.indexKeys(before[field.fieldId]) : [];
      const newKeys = after ? descriptor.indexKeys(after[field.fieldId]) : [];
      if (JSON.stringify(oldKeys) === JSON.stringify(newKeys)) continue;

      for (const key of oldKeys) {
        entry.strategy.remove(key, recordId);
        ops.push({ updateOne: { filter: { indexId: entry.def.indexId, key }, update: { $pull: { recordIds: recordId } } } });
      }
      for (const key of newKeys) {
        entry.strategy.insert(key, recordId);
        ops.push({
          updateOne: {
            filter: { indexId: entry.def.indexId, key },
            update: { $addToSet: { recordIds: recordId }, $setOnInsert: { objectId, fieldId: field.fieldId } },
            upsert: true,
          },
        });
      }
      touched += 1;
    }

    if (!ops.length) return;
    this.eventBus.publish(EVENT_TYPE.INDEX_ENTRY_UPDATED, { objectId, recordId, indexesTouched: touched });
    await this.indexEntryRepository
      .upsertKeys(ops)
      .catch((err) => logger.error(`Index persistence lag: ${err.message}`, null, 'index-manager'));
  }

  // ------------------------------------------------------------------- query

  /**
   * @returns {{ids:Set<string>, indexType:string, ms:number}|null} null when no
   * usable index exists, which tells the planner to fall back to a residual filter.
   */
  query(objectId, fieldId, operator, value) {
    const entry = this.getIndexFor(objectId, fieldId);
    if (!entry || entry.def.status !== INDEX_STATUS.ACTIVE) return null;
    if (!entry.strategy.supports(operator)) return null;

    const started = process.hrtime.bigint();
    const ids = entry.strategy.query(operator, value);
    const ms = Number(process.hrtime.bigint() - started) / 1e6;
    if (ids === null) return null;

    this.#recordQuery(entry.def.indexId, ms, ids.size > 0);
    return { ids, indexType: entry.def.type, ms };
  }

  sortedIds(objectId, fieldId, order) {
    const entry = this.getIndexFor(objectId, fieldId);
    if (!entry || entry.def.status !== INDEX_STATUS.ACTIVE) return null;
    return entry.strategy.sortedRecordIds?.(order) ?? null;
  }

  suggest(objectId, fieldId, prefix, limit = 10) {
    const entry = this.getIndexFor(objectId, fieldId);
    return entry ? entry.strategy.suggest(prefix, limit) : [];
  }

  /** Distinct-key count — the optimizer's selectivity estimate. */
  cardinality(objectId, fieldId) {
    const entry = this.getIndexFor(objectId, fieldId);
    return entry ? entry.strategy.cardinality() : null;
  }

  // ------------------------------------------------------------------- stats

  #recordQuery(indexId, ms, hit) {
    const s = this.queryStats.get(indexId) || { count: 0, totalMs: 0, hits: 0, misses: 0 };
    s.count += 1;
    s.totalMs += ms;
    if (hit) s.hits += 1;
    else s.misses += 1;
    this.queryStats.set(indexId, s);
  }

  performanceFor(indexId) {
    const s = this.queryStats.get(indexId) || { count: 0, totalMs: 0, hits: 0, misses: 0 };
    return {
      avgQueryMs: s.count ? Math.round((s.totalMs / s.count) * 1000) / 1000 : 0,
      hits: s.hits,
      misses: s.misses,
      queries: s.count,
    };
  }

  memoryStats() {
    let keys = 0;
    let postings = 0;
    for (const { strategy } of this.live.values()) {
      const s = strategy.stats();
      keys += s.keys || 0;
      postings += s.postings || 0;
    }
    return { indexes: this.live.size, keys, postings };
  }

  async #hydrate(indexId) {
    const def = await this.indexRepository.findByIndexId(indexId);
    if (!def) return null;
    const field = await this.#fieldFor(def.objectId, def.fieldId);
    const strategy = indexStrategyFactory.create(def.type, field || {});
    strategy.load(await this.indexEntryRepository.findByIndexId(indexId));
    const entry = { def, strategy, field };
    this.#install(entry);
    return entry;
  }
}
