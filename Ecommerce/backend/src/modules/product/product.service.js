import { productRepository } from './product.repository.js';
import { NotFoundError } from '../../common/errors/NotFoundError.js';

export class ProductService {
  constructor(repo = productRepository) {
    this.repo = repo;
  }

  async getProducts() {
    return this.repo.findAll();
  }

  async getProductById(id) {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundError('Product not found');
    return product;
  }
}

export const productService = new ProductService();
