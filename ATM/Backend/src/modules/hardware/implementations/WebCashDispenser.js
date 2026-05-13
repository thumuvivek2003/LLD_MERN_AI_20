import { CashDispenser } from "../interfaces/CashDispenser.js";

export class WebCashDispenser extends CashDispenser {
  dispense(breakdown) {
    return { dispensed: breakdown };
  }
}
