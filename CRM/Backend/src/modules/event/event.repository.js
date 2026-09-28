import { BaseRepository, LEAN } from '../../core/base/base.repository.js';
import { EventLogModel } from './event.model.js';

export class EventRepository extends BaseRepository {
  constructor(model = EventLogModel) {
    super(model);
  }

  list({ type, limit = 50 } = {}) {
    const filter = type ? { type } : {};
    return this.model.find(filter, LEAN).sort({ at: -1 }).limit(limit).lean();
  }

  countSince(date) {
    return this.model.countDocuments({ at: { $gte: date } });
  }
}
