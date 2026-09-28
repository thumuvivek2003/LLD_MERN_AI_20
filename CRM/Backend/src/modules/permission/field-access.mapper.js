import { FIELD_ACCESS } from '../../config/constants.js';
import { PermissionError } from '../../core/exceptions/permission.error.js';

/**
 * Field-level enforcement.
 *
 * Object-level checks belong in middleware (they can reject before any work
 * happens). Field-level checks cannot: they need the object's field list and
 * the payload, so they live here and are applied by the record mapper on the
 * way out and by the record service on the way in.
 */
export const FieldAccessMapper = {
  /** Drop HIDDEN fields from an outbound recordJson. */
  maskRecordJson(recordJson = {}, access = {}) {
    const out = {};
    for (const [fieldId, value] of Object.entries(recordJson)) {
      if (access[fieldId] === FIELD_ACCESS.HIDDEN) continue;
      out[fieldId] = value;
    }
    return out;
  },

  /** Drop HIDDEN fields from an object's metadata so the UI never renders them. */
  maskFields(fields = [], access = {}) {
    return fields
      .filter((f) => access[f.fieldId] !== FIELD_ACCESS.HIDDEN)
      .map((f) => (access[f.fieldId] === FIELD_ACCESS.READ ? { ...f, readOnly: true } : f));
  },

  visibleFieldIds(fields = [], access = {}) {
    return fields.filter((f) => access[f.fieldId] !== FIELD_ACCESS.HIDDEN).map((f) => f.fieldId);
  },

  /** Reject writes to fields the role may not write. */
  assertWritable(patch = {}, access = {}, fields = []) {
    const byId = new Map(fields.map((f) => [f.fieldId, f]));
    const denied = Object.keys(patch).filter((fieldId) => {
      const level = access[fieldId];
      return level === FIELD_ACCESS.HIDDEN || level === FIELD_ACCESS.READ;
    });
    if (!denied.length) return;
    const labels = denied.map((id) => byId.get(id)?.label || id).join(', ');
    throw new PermissionError(`You do not have write access to: ${labels}`);
  },
};
