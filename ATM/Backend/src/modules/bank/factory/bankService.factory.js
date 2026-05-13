import { SBIBankService } from "../strategies/SBIBankService.js";
import { HDFCBankService } from "../strategies/HDFCBankService.js";
import { ICICIBankService } from "../strategies/ICICIBankService.js";
import { BANK_CODE } from "../../../core/constants/bank.constants.js";
import { AppError } from "../../../core/errors/AppError.js";

export function createBankService(bankCode) {
  switch (bankCode) {
    case BANK_CODE.SBI:
      return new SBIBankService();
    case BANK_CODE.HDFC:
      return new HDFCBankService();
    case BANK_CODE.ICICI:
      return new ICICIBankService();
    default:
      throw new AppError(`Unsupported bank code: ${bankCode}`, 400, "UNSUPPORTED_BANK");
  }
}
