import { ATMState } from "./ATMState.js";
import { ATM_STATE } from "../../../core/constants/atmState.constants.js";

export class AuthenticatedState extends ATMState {
  constructor() {
    super(ATM_STATE.AUTHENTICATED);
  }

  withdrawCash() {
    return ATM_STATE.DISPENSING_CASH;
  }

  checkBalance() {
    return ATM_STATE.AUTHENTICATED;
  }

  ejectCard() {
    return ATM_STATE.IDLE;
  }
}
