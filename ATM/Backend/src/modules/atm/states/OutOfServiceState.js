import { ATMState } from "./ATMState.js";
import { ATM_STATE } from "../../../core/constants/atmState.constants.js";

export class OutOfServiceState extends ATMState {
  constructor() {
    super(ATM_STATE.OUT_OF_SERVICE);
  }
}
