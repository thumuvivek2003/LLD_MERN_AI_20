import { authApi } from '../api/auth.api.js';
import { tokenStorage } from '../utils/tokenStorage.js';

export class AuthFeatureService {
  constructor(api = authApi, storage = tokenStorage) {
    this.api = api;
    this.storage = storage;
  }

  async login(payload) {
    const result = await this.api.login(payload);
    this.storage.set(result.token);
    return result;
  }

  logout() {
    this.storage.clear();
  }
}

export const authFeatureService = new AuthFeatureService();
