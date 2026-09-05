// modules/status/status.repository.js — Repository Pattern for Status.
// The ONLY place that knows how statuses are queried in Mongo.
import { BaseRepository } from '../../core/repositories/base.repository.js';
import { StatusModel } from './status.model.js';

class StatusRepository extends BaseRepository {
  constructor() {
    super(StatusModel);
  }

  // THE scale-critical query: active statuses for a bounded friend set only.
  // Uses the (ownerId, expiresAt) compound index — never scans all users.
  findActiveStatusesByOwners(ownerIds, at = new Date()) {
    return this.model
      .find({ ownerId: { $in: ownerIds }, expiresAt: { $gt: at } })
      .sort({ createdAt: 1 })
      .lean();
  }

  // One owner's active statuses, oldest → newest (stories play in order).
  findActiveByOwner(ownerId, at = new Date()) {
    return this.model
      .find({ ownerId, expiresAt: { $gt: at } })
      .sort({ createdAt: 1 })
      .lean();
  }
}

export const statusRepository = new StatusRepository();
