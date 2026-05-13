import { ATMStateError } from "../../../core/errors/ATMStateError.js";

export class ATMState {
  constructor(name) {
    this.name = name;
  }

  insertCard() {
    throw new ATMStateError(`Cannot insert card in state ${this.name}`);
  }

  enterPin() {
    throw new ATMStateError(`Cannot enter PIN in state ${this.name}`);
  }

  withdrawCash() {
    throw new ATMStateError(`Cannot withdraw cash in state ${this.name}`);
  }

  checkBalance() {
    throw new ATMStateError(`Cannot check balance in state ${this.name}`);
  }

  ejectCard() {
    throw new ATMStateError(`Cannot eject card in state ${this.name}`);
  }
}
