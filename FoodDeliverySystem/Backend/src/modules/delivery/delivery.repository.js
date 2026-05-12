import { BaseRepository } from '../../core/base/base.repository.js';
import { DeliveryPartnerModel } from './delivery.model.js';
import { DELIVERY_STATUS } from '../../core/constants/delivery.constants.js';

class DeliveryRepository extends BaseRepository {
  constructor() {
    super(DeliveryPartnerModel);
  }

  findAvailablePartners() {
    return this.model.find({ status: DELIVERY_STATUS.AVAILABLE });
  }

  findByUserId(userId) {
    return this.model.findOne({ userId });
  }

  updateStatus(id, status) {
    return this.model.findByIdAndUpdate(id, { status }, { new: true });
  }
}

export const deliveryRepository = new DeliveryRepository();
