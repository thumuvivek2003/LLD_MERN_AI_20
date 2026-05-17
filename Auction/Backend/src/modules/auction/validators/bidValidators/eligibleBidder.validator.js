import { BaseBidValidator } from './baseBid.validator.js';
import { AuthorizationError } from '../../../../shared/errors/authorization.error.js';

export class EligibleBidderValidator extends BaseBidValidator {
  async check({ auction, user }) {
    const allowed = (auction.eligibleUserIds || []).map((x) => x.toString());
    if (!allowed.includes(user.id.toString())) {
      throw new AuthorizationError('You are not eligible to bid in this auction');
    }
  }
}
