import { ObjectState } from './object-state.js';
import { OBJECT_STATUS } from '../../../config/constants.js';

/** DRAFT — the schema is still soft. Nothing depends on it yet, so everything is editable. */
export class DraftState extends ObjectState {
  get name() {
    return OBJECT_STATUS.DRAFT;
  }

  get allowedTransitions() {
    return [OBJECT_STATUS.PUBLISHED, OBJECT_STATUS.ARCHIVED];
  }

  canEditSchema() {
    return true;
  }

  canChangeFieldType() {
    return true;
  }

  canDelete() {
    return true;
  }
}
