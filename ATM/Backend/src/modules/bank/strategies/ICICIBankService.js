import { BankService } from "./BankService.js";
import { BANK_CODE, BANK_NAME } from "../../../core/constants/bank.constants.js";

export class ICICIBankService extends BankService {
  constructor() {
    super(BANK_CODE.ICICI, BANK_NAME.ICICI);
  }
}
