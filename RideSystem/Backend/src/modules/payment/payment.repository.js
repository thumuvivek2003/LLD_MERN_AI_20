import { BaseRepository } from '../../core/base/base.repository.js';
import { Payment } from './payment.model.js';

class PaymentRepository extends BaseRepository {
  constructor() {
    super(Payment);
  }

  findByRide(rideId) {
    return this.model.findOne({ ride: rideId });
  }

  findByDriver(driverId) {
    return this.model.find({ driver: driverId }).sort({ createdAt: -1 });
  }
}

export const paymentRepository = new PaymentRepository();
