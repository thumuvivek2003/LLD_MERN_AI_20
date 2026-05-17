import { ClientModel } from '../models/Client.model.js';

export const clientRepository = {
  async findById(id) {
    return ClientModel.findById(id).lean();
  },

  async findByClientId(clientId) {
    return ClientModel.findOne({ clientId });
  },

  async findByUsername(username) {
    return ClientModel.findOne({ username });
  },

  async findByApiKey(apiKey) {
    return ClientModel.findOne({ apiKey });
  },

  async listClients() {
    return ClientModel.find({ role: 'client' }).sort({ createdAt: -1 }).lean();
  },

  async create(data) {
    return ClientModel.create(data);
  },

  async updateStatus(clientId, status) {
    return ClientModel.findOneAndUpdate({ clientId }, { status }, { new: true });
  },

  async touchLastSeen(clientId) {
    return ClientModel.updateOne({ clientId }, { lastSeen: new Date() });
  },
};
