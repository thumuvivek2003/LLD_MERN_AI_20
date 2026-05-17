import { MESSAGE_STATUS } from '../../delivery/delivery.constants.js';
import { sentState } from './sent.state.js';
import { deliveredState } from './delivered.state.js';
import { readState } from './read.state.js';

const HANDLERS = {
  [MESSAGE_STATUS.SENT]: sentState,
  [MESSAGE_STATUS.DELIVERED]: deliveredState,
  [MESSAGE_STATUS.READ]: readState,
};

export function getStateHandler(status) {
  return HANDLERS[status] || sentState;
}
