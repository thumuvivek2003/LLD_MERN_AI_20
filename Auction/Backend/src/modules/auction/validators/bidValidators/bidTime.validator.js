import { BaseBidValidator } from './baseBid.validator.js';
import { DomainRuleError } from '../../../../shared/errors/validation.error.js';
import { isWithinWindow } from '../../../../shared/utils/time.util.js';

export class BidTimeValidator extends BaseBidValidator {
  async check({ auction }) {
    if (!isWithinWindow(auction.startTime, auction.endTime)) {
      throw new DomainRuleError('Bid received outside the auction time window', 'BID_OUT_OF_WINDOW');
    }
  }
}
