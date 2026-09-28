import mongoose from 'mongoose';
import { BaseRepository, LEAN } from '../../core/base/base.repository.js';
import { SystemLogModel, AlertModel, SystemSettingModel } from './system.model.js';

export class SystemLogRepository extends BaseRepository {
  constructor(model = SystemLogModel) {
    super(model);
  }

  list({ level, limit = 100 } = {}) {
    const filter = level ? { level } : {};
    return this.model.find(filter, LEAN).sort({ at: -1 }).limit(limit).lean();
  }

  summary() {
    return this.model.aggregate([{ $group: { _id: '$level', n: { $sum: 1 } } }]);
  }

  countSince(date, level) {
    const filter = { at: { $gte: date } };
    if (level) filter.level = level;
    return this.model.countDocuments(filter);
  }
}

export class AlertRepository extends BaseRepository {
  constructor(model = AlertModel) {
    super(model);
  }

  listAll() {
    return this.model.find({}, LEAN).sort({ at: -1 }).limit(50).lean();
  }

  acknowledge(alertId) {
    return this.model.findOneAndUpdate({ alertId }, { acknowledged: true }, { new: true }).lean();
  }
}

export class SettingRepository extends BaseRepository {
  constructor(model = SystemSettingModel) {
    super(model);
  }

  get() {
    return this.model.findOneAndUpdate({ key: 'global' }, {}, { new: true, upsert: true }).lean();
  }

  patch(update) {
    return this.model.findOneAndUpdate({ key: 'global' }, update, { new: true, upsert: true }).lean();
  }
}

/**
 * Not a document repository — the boundary in front of Mongo's admin commands
 * so the system service never touches the driver directly.
 */
export class DatabaseStatsRepository {
  constructor(connection = mongoose.connection) {
    this.connection = connection;
  }

  async ping() {
    const started = process.hrtime.bigint();
    await this.connection.db.admin().ping();
    return Number(process.hrtime.bigint() - started) / 1e6;
  }

  dbStats() {
    return this.connection.db.stats();
  }

  async collectionStats() {
    const collections = await this.connection.db.listCollections().toArray();
    const out = [];
    for (const c of collections) {
      const [stats] = await this.connection.db
        .collection(c.name)
        .aggregate([{ $collStats: { storageStats: {} } }])
        .toArray()
        .catch(() => [null]);
      out.push({
        name: c.name,
        docs: stats?.storageStats?.count ?? 0,
        sizeBytes: stats?.storageStats?.size ?? 0,
      });
    }
    return out.sort((a, b) => b.sizeBytes - a.sizeBytes);
  }

  get name() {
    return this.connection.name;
  }

  get readyState() {
    return this.connection.readyState;
  }
}
