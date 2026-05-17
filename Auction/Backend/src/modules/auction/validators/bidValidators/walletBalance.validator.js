import { BaseBidValidator } from './baseBid.validator.js';
import { DomainRuleError } from '../../../../shared/errors/validation.error.js';
import { walletService } from '../../../wallet/services/wallet.service.js';

export class WalletBalanceValidator extends BaseBidValidator {
  async check({ user, amount }) {
    const balance = await walletService.getBalance(user.id);
    if (balance < amount) {
      throw new DomainRuleError(
        `Insufficient wallet balance (${balance}) for bid amount (${amount})`,
        'INSUFFICIENT_BALANCE',
      );
    }
  }
}
