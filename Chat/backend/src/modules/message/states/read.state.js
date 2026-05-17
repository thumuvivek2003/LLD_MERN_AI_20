import { MESSAGE_STATUS } from '../../delivery/delivery.constants.js';

export const readState = {
  name: MESSAGE_STATUS.READ,
  transition(_next) {
    // READ is terminal.
    return MESSAGE_STATUS.READ;
  },
};

export const transition = readState.transition;
