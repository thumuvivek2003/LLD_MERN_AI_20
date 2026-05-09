import { RequestStatus } from '../enums/RequestStatus.js';
import { PendingState } from '../state-pattern/PendingState.js';
import { ApprovedState } from '../state-pattern/ApprovedState.js';
import { ReturnedState } from '../state-pattern/ReturnedState.js';
import { RejectedState } from '../state-pattern/RejectedState.js';
import { OverdueState } from '../state-pattern/OverdueState.js';

export class BorrowStateFactory {
  static createState(status) {
    const states = {
      [RequestStatus.PENDING]: new PendingState(),
      [RequestStatus.APPROVED]: new ApprovedState(),
      [RequestStatus.RETURNED]: new ReturnedState(),
      [RequestStatus.REJECTED]: new RejectedState(),
      [RequestStatus.OVERDUE]: new OverdueState(),
    };
    const state = states[status];
    if (!state) throw new Error(`Unknown borrow status: ${status}`);
    return state;
  }
}
