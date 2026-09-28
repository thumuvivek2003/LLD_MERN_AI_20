import { BaseRepository, LEAN } from '../../core/base/base.repository.js';
import { AuditLogModel } from './audit.model.js';

export class AuditRepository extends BaseRepository {
  constructor(model = AuditLogModel) {
    super(model);
  }

  query({ objectId, recordId, userId, action, from, to, skip = 0, limit = 25 }) {
    const filter = {};
    if (objectId) filter.objectId = objectId;
    if (recordId) filter.recordId = recordId;
    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (from || to) {
      filter.at = {};
      if (from) filter.at.$gte = new Date(from);
      if (to) filter.at.$lte = new Date(to);
    }
    return Promise.all([
      this.model.find(filter, LEAN).sort({ at: -1 }).skip(skip).limit(limit).lean(),
      this.model.countDocuments(filter),
    ]);
  }

  recentForObject(objectId, limit = 10) {
    return this.model.find({ objectId }, LEAN).sort({ at: -1 }).limit(limit).lean();
  }

  recent(limit = 10) {
    return this.model.find({}, LEAN).sort({ at: -1 }).limit(limit).lean();
  }

  deleteOlderThan(date) {
    return this.model.deleteMany({ at: { $lt: date } });
  }
}
