import { NotificationModel } from '../models/notification.model.js';

export const notificationRepository = {
  async create(doc) {
    return NotificationModel.create(doc);
  },

  async insertMany(docs) {
    return NotificationModel.insertMany(docs);
  },

  async findById(id) {
    return NotificationModel.findById(id).lean();
  },

  async find(filter = {}, { limit = 50, sort = { createdAt: -1 } } = {}) {
    return NotificationModel.find(filter).sort(sort).limit(limit).lean();
  },

  async countByStatus() {
    return NotificationModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  },

  async countByChannel() {
    return NotificationModel.aggregate([
      { $group: { _id: '$channel', count: { $sum: 1 } } },
    ]);
  },

  async countByEventType() {
    return NotificationModel.aggregate([
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
    ]);
  },

  async findFailedNotifications(limit = 50) {
    return NotificationModel.find({ status: { $in: ['FAILED', 'DEAD'] } })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();
  },

  async updateStatus(id, status, extra = {}) {
    return NotificationModel.findByIdAndUpdate(
      id,
      { $set: { status, ...extra } },
      { new: true },
    ).lean();
  },

  async pushAttempt(id, attempt) {
    return NotificationModel.findByIdAndUpdate(
      id,
      { $push: { attempts: attempt } },
      { new: true },
    ).lean();
  },

  async incrementRetryCount(id) {
    return NotificationModel.findByIdAndUpdate(
      id,
      { $inc: { retryCount: 1 } },
      { new: true },
    ).lean();
  },
};
