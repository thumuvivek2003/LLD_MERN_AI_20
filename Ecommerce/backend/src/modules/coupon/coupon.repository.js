import { BaseRepository } from '../../common/database/BaseRepository.js';
import { Coupon } from './coupon.model.js';

export class CouponRepository extends BaseRepository {
  constructor() {
    super(Coupon);
  }

  findByCode(code) {
    return this.model.findOne({ code: code.toUpperCase() });
  }

  findAll() {
    return this.model.find({}).sort({ createdAt: -1 });
  }

  findEligibleFor(userId) {
    return this.model.find({
      active: true,
      $or: [{ assignedUserIds: { $size: 0 } }, { assignedUserIds: userId }],
    });
  }

  assignToUser(couponId, userId) {
    return this.model.findByIdAndUpdate(
      couponId,
      { $addToSet: { assignedUserIds: userId } },
      { new: true }
    );
  }

  unassignUser(couponId, userId) {
    return this.model.findByIdAndUpdate(
      couponId,
      { $pull: { assignedUserIds: userId } },
      { new: true }
    );
  }

  findAssignedTo(userId) {
    return this.model.find({ assignedUserIds: userId });
  }
}

export const couponRepository = new CouponRepository();
