import { ATMState } from "./ATMState.js";
import { ATM_STATE } from "../../../core/constants/atmState.constants.js";

export class CardInsertedState extends ATMState {
  constructor() {
    super(ATM_STATE.CARD_INSERTED);
  }

  enterPin(authenticated) {
    return authenticated ? ATM_STATE.AUTHENTICATED : ATM_STATE.CARD_INSERTED;
  }

  ejectCard() {
    return ATM_STATE.IDLE;
  }
}
