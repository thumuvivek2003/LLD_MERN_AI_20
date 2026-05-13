import { ATMState } from "./ATMState.js";
import { ATM_STATE } from "../../../core/constants/atmState.constants.js";

export class IdleState extends ATMState {
  constructor() {
    super(ATM_STATE.IDLE);
  }

  insertCard() {
    return ATM_STATE.CARD_INSERTED;
  }
}
