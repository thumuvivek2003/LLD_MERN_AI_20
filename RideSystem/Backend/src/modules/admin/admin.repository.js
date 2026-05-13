import { User } from '../user/user.model.js';
import { Ride } from '../ride/ride.model.js';
import { Driver } from '../driver/driver.model.js';
import { Payment } from '../payment/payment.model.js';

export const adminRepository = {
  countUsers: (filter = {}) => User.countDocuments(filter),
  countRides: (filter = {}) => Ride.countDocuments(filter),
  countDrivers: (filter = {}) => Driver.countDocuments(filter),
  sumPaidAmount: async () => {
    const [agg] = await Payment.aggregate([
      { $match: { status: 'PAID' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    return agg?.total || 0;
  },
  listUsersByRole: (role) => User.find({ role }).sort({ createdAt: -1 }),
  setBlocked: (id, isBlocked) => User.findByIdAndUpdate(id, { isBlocked }, { new: true }),
  listAllRides: () => Ride.find().sort({ createdAt: -1 }).populate('rider').populate('driver'),
};
