import { BankService } from "./BankService.js";
import { BANK_CODE, BANK_NAME } from "../../../core/constants/bank.constants.js";

export class HDFCBankService extends BankService {
  constructor() {
    super(BANK_CODE.HDFC, BANK_NAME.HDFC);
  }
}
