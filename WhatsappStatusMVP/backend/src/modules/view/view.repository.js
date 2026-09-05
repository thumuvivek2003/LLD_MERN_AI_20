// modules/view/view.repository.js — Repository for StatusView.
import { BaseRepository } from '../../core/repositories/base.repository.js';
import { StatusViewModel } from './view.model.js';

class ViewRepository extends BaseRepository {
  constructor() {
    super(StatusViewModel);
  }

  // Idempotent insert: upsert so a duplicate view never creates a second row
  // and never throws on the unique index (business rule: view once).
  async recordView(statusId, viewerId) {
    return this.model.updateOne(
      { statusId, viewerId },
      { $setOnInsert: { statusId, viewerId, viewedAt: new Date() } },
      { upsert: true }
    );
  }

  exists(statusId, viewerId) {
    return this.model.exists({ statusId, viewerId });
  }

  // All statusIds (from a candidate set) this viewer has already seen.
  async findSeenStatusIds(viewerId, statusIds) {
    const rows = await this.model
      .find({ viewerId, statusId: { $in: statusIds } })
      .select('statusId')
      .lean();
    return rows.map((r) => String(r.statusId));
  }

  // Viewers of a given status, newest first, for the owner's viewers list.
  findViewersOfStatus(statusId) {
    return this.model.find({ statusId }).sort({ viewedAt: -1 }).lean();
  }

  countViewers(statusId) {
    return this.model.countDocuments({ statusId });
  }
}

export const viewRepository = new ViewRepository();
