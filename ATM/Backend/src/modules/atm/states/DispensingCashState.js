import { ATMState } from "./ATMState.js";
import { ATM_STATE } from "../../../core/constants/atmState.constants.js";

export class DispensingCashState extends ATMState {
  constructor() {
    super(ATM_STATE.DISPENSING_CASH);
  }

  collectCash() {
    return ATM_STATE.AUTHENTICATED;
  }

  ejectCard() {
    return ATM_STATE.IDLE;
  }
}
