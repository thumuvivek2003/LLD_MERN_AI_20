import { MESSAGE_STATUS } from '../../delivery/delivery.constants.js';

export const sentState = {
  name: MESSAGE_STATUS.SENT,
  transition(next) {
    // SENT can move to DELIVERED or READ.
    if (next === MESSAGE_STATUS.DELIVERED) return MESSAGE_STATUS.DELIVERED;
    if (next === MESSAGE_STATUS.READ) return MESSAGE_STATUS.READ;
    return MESSAGE_STATUS.SENT;
  },
};

export const transition = sentState.transition;
