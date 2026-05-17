import { productRepository } from '../product/product.repository.js';
import { InventorySingleton } from './InventorySingleton.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { NotFoundError } from '../../common/errors/NotFoundError.js';

export class InventoryService {
  constructor() {
    this.registry = InventorySingleton.getInstance();
  }

  async validateStock(items = []) {
    for (const it of items) {
      const product = await productRepository.findById(it.productId);
      if (!product) throw new NotFoundError(`Product ${it.productId} not found`);
      if (product.stock < it.quantity) {
        throw new ValidationError(`Insufficient stock for ${product.name}`, 'OUT_OF_STOCK');
      }
    }
    return true;
  }

  async reserveStock(items = []) {
    for (const it of items) {
      await productRepository.decrementStock(it.productId, it.quantity);
      this.registry.reserve(it.productId, it.quantity);
    }
  }

  async releaseStock(items = []) {
    for (const it of items) {
      await productRepository.decrementStock(it.productId, -it.quantity);
      this.registry.release(it.productId, it.quantity);
    }
  }
}

export const inventoryService = new InventoryService();
