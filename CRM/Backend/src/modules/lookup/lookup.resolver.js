import { FIELD_TYPE, EVENT_TYPE } from '../../config/constants.js';
import { fieldTypeRegistry } from '../field/types/field-type.registry.js';

/**
 * Forward lookup resolution: `recordJson.f5 = "rec_ABC"` → the `resolved` map
 * CONTRACT.md §4 attaches to a displayed record.
 *
 * Batched by target object so rendering a 25-row table costs one query per
 * distinct lookup target, not 25 × fields.
 */
export class LookupResolver {
  constructor({ recordRepository, metadataCache, eventBus }) {
    this.recordRepository = recordRepository;
    this.metadataCache = metadataCache;
    this.eventBus = eventBus;
    this.counters = { resolved: 0, failed: 0 };
    this.recentFailures = [];
  }

  static lookupFields(objectDef) {
    return (objectDef.fields || []).filter((f) => f.type === FIELD_TYPE.LOOKUP);
  }

  /** @returns {Map<recordId, {fieldId: {recordId, displayName, objectId}}>} */
  async resolveMany(objectDef, records) {
    const lookupFields = LookupResolver.lookupFields(objectDef);
    const out = new Map();
    if (!lookupFields.length || !records.length) return out;

    const wanted = new Map(); // targetObjectId -> Set<recordId>
    for (const record of records) {
      for (const field of lookupFields) {
        const targetId = record.recordJson?.[field.fieldId];
        if (!targetId) continue;
        const key = field.lookup.objectId;
        if (!wanted.has(key)) wanted.set(key, new Set());
        wanted.get(key).add(targetId);
      }
    }
    if (!wanted.size) return out;

    const targets = new Map(); // `${objectId}:${recordId}` -> {displayName,...}
    for (const [targetObjectId, ids] of wanted) {
      const rows = await this.recordRepository.findManyByIds([...ids], {
        recordId: 1,
        displayName: 1,
        objectId: 1,
        status: 1,
        _id: 0,
      });
      for (const row of rows) targets.set(`${targetObjectId}:${row.recordId}`, row);
    }

    for (const record of records) {
      for (const field of lookupFields) {
        const targetId = record.recordJson?.[field.fieldId];
        if (!targetId) continue;
        const hit = targets.get(`${field.lookup.objectId}:${targetId}`);
        if (!out.has(record.recordId)) out.set(record.recordId, {});
        if (hit) {
          this.counters.resolved += 1;
          out.get(record.recordId)[field.fieldId] = {
            recordId: hit.recordId,
            displayName: hit.displayName,
            objectId: hit.objectId,
          };
        } else {
          this.#registerFailure(objectDef, field, targetId);
          out.get(record.recordId)[field.fieldId] = { recordId: targetId, displayName: '(missing)', objectId: field.lookup.objectId };
        }
      }
    }
    return out;
  }

  async resolveOne(objectDef, record) {
    const map = await this.resolveMany(objectDef, [record]);
    return map.get(record.recordId) || {};
  }

  /** Display value for a child record's summary row. */
  static summaryOf(objectDef, record, fieldIds) {
    const out = {};
    for (const fieldId of fieldIds) {
      const field = objectDef.fields.find((f) => f.fieldId === fieldId);
      if (!field) continue;
      out[fieldId] = fieldTypeRegistry.get(field.type).display(record.recordJson?.[fieldId]);
    }
    return out;
  }

  #registerFailure(objectDef, field, targetId) {
    this.counters.failed += 1;
    this.recentFailures.unshift({
      fromObject: objectDef.label,
      field: field.label,
      toObject: field.lookup.objectId,
      reason: `Target record '${targetId}' not found`,
      at: new Date(),
    });
    this.recentFailures.length = Math.min(this.recentFailures.length, 20);
    this.eventBus.publish(EVENT_TYPE.LOOKUP_FAILED, {
      objectId: objectDef.objectId,
      objectLabel: objectDef.label,
      fieldId: field.fieldId,
      targetId,
    });
  }

  stats() {
    const total = this.counters.resolved + this.counters.failed;
    return {
      total,
      resolved: this.counters.resolved,
      failed: this.counters.failed,
      resolutionRate: total ? Math.round((this.counters.resolved / total) * 1000) / 10 : 100,
      recentFailures: this.recentFailures.slice(0, 10),
    };
  }
}
