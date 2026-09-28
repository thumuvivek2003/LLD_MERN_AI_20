import { IValidator } from '../../../core/interfaces/validator.interface.js';
import { FIELD_TYPE, OBJECT_STATUS, RECORD_STATUS } from '../../../config/constants.js';

/**
 * Referential integrity for the metadata-driven "foreign key":
 * the target record must exist, be active, and belong to a PUBLISHED object.
 */
export class LookupExistsValidator extends IValidator {
  get rule() {
    return 'LOOKUP_EXISTS';
  }

  appliesTo(field) {
    return field.type === FIELD_TYPE.LOOKUP;
  }

  async validate({ field, value, deps }) {
    if (value === null || value === undefined || value === '') return null;
    const targetObjectId = field.lookup?.objectId;
    if (!targetObjectId) return this.error(field, `${field.label} has no target object configured`);

    const targetObject = await deps.metadataCache.getObject(targetObjectId);
    if (!targetObject) return this.error(field, `${field.label} points at unknown object '${targetObjectId}'`);
    if (targetObject.status !== OBJECT_STATUS.PUBLISHED) {
      return this.error(field, `${field.label}: '${targetObject.label}' is not published`);
    }

    const target = await deps.recordRepository.findOne(
      { recordId: value, objectId: targetObjectId },
      { recordId: 1, status: 1 },
    );
    if (!target) return this.error(field, `${field.label}: related ${targetObject.label} '${value}' does not exist`);
    if (target.status !== RECORD_STATUS.ACTIVE) {
      return this.error(field, `${field.label}: related ${targetObject.label} is archived`);
    }
    return null;
  }
}
