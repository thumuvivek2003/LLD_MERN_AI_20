import { MESSAGE_STATUS } from '../../delivery/delivery.constants.js';

export const deliveredState = {
  name: MESSAGE_STATUS.DELIVERED,
  transition(next) {
    // DELIVERED can only move to READ.
    if (next === MESSAGE_STATUS.READ) return MESSAGE_STATUS.READ;
    return MESSAGE_STATUS.DELIVERED;
  },
};

export const transition = deliveredState.transition;
