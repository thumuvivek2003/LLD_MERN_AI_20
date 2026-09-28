import { RecordBuilder } from './record.builder.js';
import { EVENT_TYPE, RECORD_STATUS } from '../../config/constants.js';
import { BadRequestError } from '../../core/exceptions/bad-request.error.js';
import { ValidationError } from '../../core/exceptions/validation.error.js';

const ACTIONS = new Set(['UPDATE', 'ARCHIVE', 'RESTORE']);

/**
 * Bulk operations and CSV/JSON import.
 *
 * The interesting LLD property here is **per-row error collection**: one bad row
 * must not abort the batch, and every failure has to come back attributed to its
 * record. So each row runs through the same single-record path (same validation,
 * same events) inside its own try/catch, rather than a separate "fast" code path
 * that would inevitably drift from the real rules.
 */
export class RecordBulkService {
  constructor({ recordService, recordRepository, metadataCache, validationService, settingRepository, eventBus }) {
    this.recordService = recordService;
    this.recordRepository = recordRepository;
    this.metadataCache = metadataCache;
    this.validationService = validationService;
    this.settingRepository = settingRepository;
    this.eventBus = eventBus;
  }

  async #maxBulkSize() {
    const settings = await this.settingRepository.get();
    return settings?.maxBulkSize || 500;
  }

  async bulk(objectId, { action, recordIds = [], patch = {} }, actor) {
    if (!ACTIONS.has(action)) throw new BadRequestError(`action must be one of ${[...ACTIONS].join(', ')}`);
    if (!Array.isArray(recordIds) || !recordIds.length) throw new BadRequestError('recordIds must be a non-empty array');

    const max = await this.#maxBulkSize();
    if (recordIds.length > max) throw new BadRequestError(`Bulk operations are limited to ${max} records`);

    const { objectDef } = await this.recordService.context(objectId, actor);
    const result = { processed: 0, succeeded: 0, failed: 0, errors: [] };

    for (const recordId of recordIds) {
      result.processed += 1;
      try {
        if (action === 'UPDATE') await this.recordService.update(objectId, recordId, { recordJson: patch }, actor);
        if (action === 'ARCHIVE') await this.recordService.archive(objectId, recordId, actor);
        if (action === 'RESTORE') await this.recordService.restore(objectId, recordId, actor);
        result.succeeded += 1;
      } catch (err) {
        result.failed += 1;
        result.errors.push({ recordId, message: RecordBulkService.#reason(err) });
      }
    }

    this.eventBus.publish(EVENT_TYPE.RECORD_BULK, {
      objectId,
      objectLabel: objectDef.label,
      action,
      ...result,
      actor,
    });
    return result;
  }

  /**
   * `mapping` maps an incoming column name to a fieldId, which is how the UI's
   * column→field mapper screen talks to the backend.
   */
  async import(objectId, { rows = [], mapping = {}, dryRun = false }, actor) {
    if (!Array.isArray(rows) || !rows.length) throw new BadRequestError('rows must be a non-empty array');
    const max = await this.#maxBulkSize();
    if (rows.length > max) throw new BadRequestError(`Imports are limited to ${max} rows per request`);

    const { objectDef } = await this.recordService.context(objectId, actor);
    const result = { processed: 0, succeeded: 0, failed: 0, errors: [], dryRun: Boolean(dryRun) };
    const preview = [];
    const batchSeen = new Set();

    for (const [i, row] of rows.entries()) {
      result.processed += 1;
      const rowRef = `row ${i + 1}`;
      const recordJson = {};
      for (const [column, fieldId] of Object.entries(mapping)) {
        if (fieldId && Object.hasOwn(row, column)) recordJson[fieldId] = row[column];
      }

      try {
        const built = RecordBuilder.for(objectDef).asActor(actor).withInput(recordJson).build();
        const errors = [
          ...built.errors,
          ...(await this.validationService.validateRecord({
            objectDef,
            recordJson: built.recordJson,
            isCreate: true,
            touched: built.touched,
            batchSeen,
          })),
        ];
        if (errors.length) throw new ValidationError(errors);

        if (dryRun) {
          preview.push({ row: i + 1, displayName: built.displayName, recordJson: built.recordJson, valid: true });
        } else {
          await this.recordRepository.create(built.doc);
          this.eventBus.publish(EVENT_TYPE.RECORD_CREATED, {
            objectId,
            objectLabel: objectDef.label,
            recordId: built.doc.recordId,
            displayName: built.displayName,
            before: null,
            after: built.recordJson,
            source: 'IMPORT',
            actor,
          });
        }
        result.succeeded += 1;
      } catch (err) {
        result.failed += 1;
        result.errors.push({ recordId: rowRef, message: RecordBulkService.#reason(err) });
        if (dryRun) preview.push({ row: i + 1, valid: false, message: RecordBulkService.#reason(err), recordJson });
      }
    }

    if (!dryRun) {
      this.eventBus.publish(EVENT_TYPE.RECORD_BULK, {
        objectId,
        objectLabel: objectDef.label,
        action: 'IMPORT',
        ...result,
        actor,
      });
    }
    return dryRun ? { ...result, preview } : result;
  }

  /** Sample rows the import screen offers as a downloadable template. */
  async sample(objectId, actor) {
    const { objectDef } = await this.recordService.context(objectId, actor);
    const [example] = await this.recordRepository.listByObject(objectId, { status: RECORD_STATUS.ACTIVE, limit: 1 });
    const columns = objectDef.fields.filter((f) => !f.readOnly).map((f) => ({ column: f.label, fieldId: f.fieldId, type: f.type }));
    return { columns, example: example?.[0]?.recordJson || null };
  }

  static #reason(err) {
    if (err?.details?.length) return err.details.map((d) => d.message).join('; ');
    return err?.message || 'Unknown error';
  }
}
