import { authApi } from '../api/auth.api.js';

export class AuthFeatureService {
  constructor(api = authApi) {
    this.api = api;
  }

  async login(credentials) {
    const result = await this.api.login(credentials);
    return {
      token: result.token,
      user: result.user || { email: credentials.email, role: result.role },
    };
  }

  async register(payload) {
    return this.api.register(payload);
  }
}

export const authFeatureService = new AuthFeatureService();
