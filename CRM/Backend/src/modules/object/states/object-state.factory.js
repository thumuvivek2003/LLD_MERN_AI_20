import { DraftState } from './draft.state.js';
import { PublishedState } from './published.state.js';
import { ArchivedState } from './archived.state.js';
import { OBJECT_STATUS } from '../../../config/constants.js';
import { BadRequestError } from '../../../core/exceptions/bad-request.error.js';

const STATES = {
  [OBJECT_STATUS.DRAFT]: new DraftState(),
  [OBJECT_STATUS.PUBLISHED]: new PublishedState(),
  [OBJECT_STATUS.ARCHIVED]: new ArchivedState(),
};

export const objectStateFactory = {
  for(objectDefOrStatus) {
    const status = typeof objectDefOrStatus === 'string' ? objectDefOrStatus : objectDefOrStatus?.status;
    const state = STATES[status];
    if (!state) throw new BadRequestError(`Unknown object status '${status}'`);
    return state;
  },

  all: () => Object.values(STATES).map((s) => s.describe()),
};
