import { ObjectState } from './object-state.js';
import { OBJECT_STATUS } from '../../../config/constants.js';

/**
 * PUBLISHED — the only state that accepts records.
 * Fields may still be added or relabelled (that is the whole point of a
 * metadata platform), but changing a field's *type* is gated separately because
 * existing records already hold values in the old type.
 */
export class PublishedState extends ObjectState {
  get name() {
    return OBJECT_STATUS.PUBLISHED;
  }

  get allowedTransitions() {
    return [OBJECT_STATUS.ARCHIVED];
  }

  canCreateRecords() {
    return true;
  }

  canEditRecords() {
    return true;
  }

  canEditSchema() {
    return true;
  }

  canChangeFieldType() {
    return true; // subject to "no existing records", enforced by the field service
  }

  canDelete() {
    return true; // subject to "no records, no inbound lookups", enforced by the object service
  }
}
