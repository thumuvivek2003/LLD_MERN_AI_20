import { ObjectState } from './object-state.js';
import { OBJECT_STATUS } from '../../../config/constants.js';

/** ARCHIVED — read-only. Existing records stay queryable; nothing new may be written. */
export class ArchivedState extends ObjectState {
  get name() {
    return OBJECT_STATUS.ARCHIVED;
  }

  get allowedTransitions() {
    return [OBJECT_STATUS.PUBLISHED];
  }

  canDelete() {
    return true;
  }
}
