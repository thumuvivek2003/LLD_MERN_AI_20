import { BaseRepository } from '../../common/database/BaseRepository.js';
import { Order } from './order.model.js';

export class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  findForUser(userId) {
    return this.model.find({ userId }).sort({ createdAt: -1 });
  }

  findAllAll() {
    return this.model.find({}).sort({ createdAt: -1 });
  }
}

export const orderRepository = new OrderRepository();
