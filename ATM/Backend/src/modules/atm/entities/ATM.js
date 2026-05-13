import { ATM_STATE } from "../../../core/constants/atmState.constants.js";
import { IdleState } from "../states/IdleState.js";
import { CardInsertedState } from "../states/CardInsertedState.js";
import { AuthenticatedState } from "../states/AuthenticatedState.js";
import { DispensingCashState } from "../states/DispensingCashState.js";
import { OutOfServiceState } from "../states/OutOfServiceState.js";

const STATE_MAP = {
  [ATM_STATE.IDLE]: () => new IdleState(),
  [ATM_STATE.CARD_INSERTED]: () => new CardInsertedState(),
  [ATM_STATE.AUTHENTICATED]: () => new AuthenticatedState(),
  [ATM_STATE.DISPENSING_CASH]: () => new DispensingCashState(),
  [ATM_STATE.OUT_OF_SERVICE]: () => new OutOfServiceState(),
};

export class ATM {
  constructor(initial = ATM_STATE.IDLE) {
    this.currentStateName = initial;
    this.state = STATE_MAP[initial]();
  }

  setState(stateName) {
    if (!STATE_MAP[stateName]) throw new Error(`Unknown state: ${stateName}`);
    this.currentStateName = stateName;
    this.state = STATE_MAP[stateName]();
  }

  getState() {
    return this.currentStateName;
  }

  handleOperation(operation, ...args) {
    if (typeof this.state[operation] !== "function") {
      throw new Error(`Operation ${operation} not allowed in ${this.currentStateName}`);
    }
    const next = this.state[operation](...args);
    if (next) this.setState(next);
    return this.currentStateName;
  }
}
