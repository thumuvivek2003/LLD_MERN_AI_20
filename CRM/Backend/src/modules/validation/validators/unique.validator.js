import { IValidator } from '../../../core/interfaces/validator.interface.js';
import { fieldTypeRegistry } from '../../field/types/field-type.registry.js';

export class UniqueValidator extends IValidator {
  get rule() {
    return 'UNIQUE';
  }

  appliesTo(field) {
    return field.unique === true;
  }

  async validate({ field, value, objectDef, recordId, deps, batchSeen }) {
    const descriptor = fieldTypeRegistry.get(field.type);
    if (descriptor.isEmpty(value)) return null;

    // Within a single import batch the rows are not yet persisted, so the
    // batch's own duplicates have to be caught in memory.
    if (batchSeen) {
      const key = `${field.fieldId}:${value}`;
      if (batchSeen.has(key)) return this.error(field, `${field.label} '${value}' is duplicated in this batch`);
      batchSeen.add(key);
    }

    const exists = await deps.recordRepository.existsWithFieldValue(objectDef.objectId, field.fieldId, value, recordId);
    if (!exists) return null;
    return this.error(field, field.validation?.message || `${field.label} '${value}' already exists`);
  }
}
