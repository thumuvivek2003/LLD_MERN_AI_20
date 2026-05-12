import { BaseRepository } from '../../core/base/base.repository.js';
import { OrderModel } from './order.model.js';

class OrderRepository extends BaseRepository {
  constructor() {
    super(OrderModel);
  }

  findOrdersByUser(customerId) {
    return this.model.find({ customerId }).sort({ createdAt: -1 });
  }

  findOrdersByRestaurant(restaurantId, filter = {}) {
    return this.model.find({ restaurantId, ...filter }).sort({ createdAt: -1 });
  }

  findOrdersByDeliveryPartner(deliveryPartnerId, filter = {}) {
    return this.model.find({ deliveryPartnerId, ...filter }).sort({ createdAt: -1 });
  }

  updateOrderStatus(id, status) {
    return this.model.findByIdAndUpdate(
      id,
      { status, $push: { statusHistory: { status, at: new Date() } } },
      { new: true }
    );
  }
}

export const orderRepository = new OrderRepository();
