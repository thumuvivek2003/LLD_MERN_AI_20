import { BaseRepository } from '../../common/database/BaseRepository.js';
import { Product } from './product.model.js';

export class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  findAll() {
    return this.model.find({}).sort({ createdAt: -1 });
  }

  decrementStock(id, qty) {
    return this.model.findByIdAndUpdate(id, { $inc: { stock: -qty } }, { new: true });
  }
}

export const productRepository = new ProductRepository();
