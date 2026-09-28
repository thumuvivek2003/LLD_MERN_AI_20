import { FIELD_TYPE, OBJECT_STATUS } from '../../config/constants.js';
import { ConflictError } from '../../core/exceptions/conflict.error.js';
import { NotFoundError } from '../../core/exceptions/not-found.error.js';

/**
 * Metadata-time guards for lookup fields.
 *
 * These run when a *field* is created or edited (not when a record is saved) —
 * the schema-level half of the Lookup Engine. Record-level referential
 * integrity is the LookupExistsValidator's job.
 */
export class LookupGuard {
  constructor({ metadataCache }) {
    this.metadataCache = metadataCache;
  }

  async assertValidTarget(lookup) {
    if (!lookup?.objectId) throw new ConflictError('Lookup fields must declare a target objectId');
    const target = await this.metadataCache.getObject(lookup.objectId);
    if (!target) throw new NotFoundError('Lookup target object', lookup.objectId);
    if (target.status === OBJECT_STATUS.ARCHIVED) {
      throw new ConflictError(`Cannot point a lookup at archived object '${target.label}'`);
    }
    if (lookup.displayFieldId && !target.fields.some((f) => f.fieldId === lookup.displayFieldId)) {
      throw new NotFoundError('Lookup display field', lookup.displayFieldId);
    }
    return target;
  }

  /**
   * Depth-first walk of the lookup graph from the proposed target.
   * If the source object is reachable, adding this edge would close a cycle —
   * which would make forward resolution and CASCADE deletes non-terminating.
   */
  async assertNoCycle(sourceObjectId, targetObjectId) {
    if (sourceObjectId === targetObjectId) {
      throw new ConflictError('A lookup cannot point an object at itself');
    }
    const all = await this.metadataCache.getAllObjects();
    const byId = new Map(all.map((o) => [o.objectId, o]));

    const seen = new Set();
    const stack = [targetObjectId];
    const path = [targetObjectId];

    while (stack.length) {
      const current = stack.pop();
      if (seen.has(current)) continue;
      seen.add(current);
      const obj = byId.get(current);
      if (!obj) continue;
      for (const field of obj.fields || []) {
        if (field.type !== FIELD_TYPE.LOOKUP) continue;
        const next = field.lookup?.objectId;
        if (!next) continue;
        if (next === sourceObjectId) {
          throw new ConflictError(
            `Circular lookup: ${sourceObjectId} → ${path.join(' → ')} → ${obj.objectId}.${field.label} → ${sourceObjectId}`,
          );
        }
        stack.push(next);
        path.push(next);
      }
    }
  }

  /** Blocks deleting a field another object's lookup depends on for display. */
  async assertNotUsedAsDisplayField(objectId, fieldId) {
    const all = await this.metadataCache.getAllObjects();
    for (const obj of all) {
      for (const field of obj.fields || []) {
        if (field.lookup?.objectId === objectId && field.lookup?.displayFieldId === fieldId) {
          throw new ConflictError(`Field is used as the display field of ${obj.label}.${field.label}`);
        }
      }
    }
  }
}
