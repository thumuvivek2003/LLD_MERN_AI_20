import { BaseService } from '../../core/base/base.service.js';
import { paymentRepository } from './payment.repository.js';
import { PaymentStrategyFactory } from './strategies/payment-strategy.factory.js';
import { rideService } from '../ride/ride.service.js';
import { driverService } from '../driver/driver.service.js';
import { PaymentPublisher } from '../../core/event-bus/publishers/payment.publisher.js';
import { paymentCompletedPayload } from './events/payment-completed.event.js';
import { RideError } from '../../core/exceptions/ride.error.js';
import { AppError } from '../../core/exceptions/app.error.js';
import { PAYMENT_STATUS, RIDE_STATUS } from '../../config/constants.js';

class PaymentService extends BaseService {
  constructor() {
    super(paymentRepository);
  }

  async pay(rideId, riderId, method) {
    const ride = await rideService.getById(rideId);
    if (String(ride.rider._id || ride.rider) !== String(riderId)) {
      throw new RideError('Not your ride', 403);
    }
    if (ride.status !== RIDE_STATUS.COMPLETED) {
      throw new RideError('Ride not completed yet', 400);
    }
    if (ride.paymentStatus === PAYMENT_STATUS.PAID) {
      throw new RideError('Payment already done', 409);
    }

    const strategy = PaymentStrategyFactory.get(method);
    const result = await strategy.process({ amount: ride.fare });
    if (!result.ok) throw new AppError('Payment failed', 402);

    const existing = await this.repository.findByRide(rideId);
    const payment = existing
      ? await this.repository.updateById(existing._id, {
          method,
          status: PAYMENT_STATUS.PAID,
          transactionRef: result.ref,
          paidAt: new Date(),
        })
      : await this.repository.create({
          ride: ride._id,
          rider: ride.rider._id || ride.rider,
          driver: ride.driver._id || ride.driver,
          amount: ride.fare,
          method,
          status: PAYMENT_STATUS.PAID,
          transactionRef: result.ref,
          paidAt: new Date(),
        });

    ride.paymentStatus = PAYMENT_STATUS.PAID;
    await ride.save();

    await driverService.incrementEarnings(ride.driver._id || ride.driver, ride.fare);

    PaymentPublisher.paymentCompleted(paymentCompletedPayload(payment));
    return payment;
  }

  getByRide(rideId) {
    return this.repository.findByRide(rideId);
  }

  listForDriver(driverId) {
    return this.repository.findByDriver(driverId);
  }
}

export const paymentService = new PaymentService();
