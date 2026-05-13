import { BankService } from "./BankService.js";
import { BANK_CODE, BANK_NAME } from "../../../core/constants/bank.constants.js";

export class SBIBankService extends BankService {
  constructor() {
    super(BANK_CODE.SBI, BANK_NAME.SBI);
  }

  async authenticate(cardNumber, pin) {
    return super.authenticate(cardNumber, pin);
  }

  async checkBalance(cardNumber) {
    return super.checkBalance(cardNumber);
  }

  async withdraw(cardNumber, amount) {
    return super.withdraw(cardNumber, amount);
  }
}
