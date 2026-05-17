import { ClientModel } from '../rateLimiter/models/Client.model.js';

export const authRepository = {
  async findClientByApiKey(apiKey) {
    return ClientModel.findOne({ apiKey });
  },

  async findByUsername(username) {
    return ClientModel.findOne({ username });
  },

  async findById(id) {
    return ClientModel.findById(id);
  },

  async createClient(data) {
    return ClientModel.create(data);
  },
};
