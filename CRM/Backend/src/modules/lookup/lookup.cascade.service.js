import { RECORD_STATUS, ON_DELETE, EVENT_TYPE } from '../../config/constants.js';
import { ConflictError } from '../../core/exceptions/conflict.error.js';

const MAX_DEPTH = 5;

/**
 * `onDelete` semantics for the reverse side of a lookup, applied when a parent
 * record is archived (this platform soft-deletes, so "delete" means archive).
 *
 *   RESTRICT  refuse while children exist   — the safe default
 *   CASCADE   archive the children too
 *   SET_NULL  keep the children, clear the reference
 *
 * The rule is metadata, not code: it is read from `field.lookup.onDelete`.
 */
export class LookupCascadeService {
  constructor({ recordRepository, metadataCache, eventBus }) {
    this.recordRepository = recordRepository;
    this.metadataCache = metadataCache;
    this.eventBus = eventBus;
  }

  /** All `{objectId, field}` pairs whose lookup points at `objectId`. */
  async inboundReferences(objectId) {
    const all = await this.metadataCache.getAllObjects();
    const out = [];
    for (const obj of all) {
      for (const field of obj.fields || []) {
        if (field.lookup?.objectId === objectId) out.push({ objectDef: obj, field });
      }
    }
    return out;
  }

  async apply(objectDef, record, actor, depth = 0) {
    if (depth > MAX_DEPTH) throw new ConflictError('Cascade depth limit reached — check for a lookup cycle');
    const references = await this.inboundReferences(objectDef.objectId);
    const summary = { restricted: 0, cascaded: 0, nulled: 0, details: [] };

    for (const { objectDef: childObject, field } of references) {
      const count = await this.recordRepository.countByFieldValue(childObject.objectId, field.fieldId, record.recordId);
      if (!count) continue;

      const rule = field.lookup.onDelete || ON_DELETE.RESTRICT;
      if (rule === ON_DELETE.RESTRICT) {
        throw new ConflictError(
          `Cannot archive '${record.displayName}': ${count} ${childObject.pluralLabel} still reference it via ${field.label}`,
        );
      }

      const children = await this.recordRepository.findByFieldValue(childObject.objectId, field.fieldId, record.recordId);

      if (rule === ON_DELETE.CASCADE) {
        for (const child of children) {
          await this.recordRepository.updateByRecordId(child.recordId, {
            $set: { status: RECORD_STATUS.ARCHIVED, updatedBy: actor.userId },
          });
          this.eventBus.publish(EVENT_TYPE.RECORD_ARCHIVED, {
            objectId: childObject.objectId,
            objectLabel: childObject.label,
            recordId: child.recordId,
            displayName: child.displayName,
            before: child.recordJson,
            cascadedFrom: record.recordId,
            actor,
          });
          await this.apply(childObject, child, actor, depth + 1);
        }
        summary.cascaded += children.length;
        summary.details.push({ object: childObject.label, field: field.label, rule, count: children.length });
      }

      if (rule === ON_DELETE.SET_NULL) {
        for (const child of children) {
          const after = { ...child.recordJson, [field.fieldId]: null };
          await this.recordRepository.updateByRecordId(child.recordId, {
            $set: { recordJson: after, updatedBy: actor.userId },
          });
          this.eventBus.publish(EVENT_TYPE.RECORD_UPDATED, {
            objectId: childObject.objectId,
            objectLabel: childObject.label,
            recordId: child.recordId,
            displayName: child.displayName,
            before: child.recordJson,
            after,
            reason: 'SET_NULL cascade',
            actor,
          });
        }
        summary.nulled += children.length;
        summary.details.push({ object: childObject.label, field: field.label, rule, count: children.length });
      }
    }
    return summary;
  }
}
