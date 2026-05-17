import { productRepository } from '../product/product.repository.js';

/**
 * Singleton that owns the (here-in-memory) reservation tracker for an MVP.
 * In a real system this would back onto Redis/DB locks; we keep it simple.
 */
class InventoryRegistry {
  constructor() {
    this.reservations = new Map(); // productId -> reserved qty
  }

  async getAvailable(productId) {
    const product = await productRepository.findById(productId);
    if (!product) return 0;
    const reserved = this.reservations.get(String(productId)) || 0;
    return product.stock - reserved;
  }

  reserve(productId, qty) {
    const key = String(productId);
    this.reservations.set(key, (this.reservations.get(key) || 0) + qty);
  }

  release(productId, qty) {
    const key = String(productId);
    const current = this.reservations.get(key) || 0;
    this.reservations.set(key, Math.max(0, current - qty));
  }
}

let instance = null;

export const InventorySingleton = {
  getInstance() {
    if (!instance) instance = new InventoryRegistry();
    return instance;
  },
};
