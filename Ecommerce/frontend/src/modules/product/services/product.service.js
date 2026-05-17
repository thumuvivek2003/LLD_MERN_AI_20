import { apiClient } from '../../../shared/services/apiClient.js';

export async function getProducts() {
  return apiClient.get('/products');
}

export async function getProductById(id) {
  return apiClient.get(`/products/${id}`);
}
