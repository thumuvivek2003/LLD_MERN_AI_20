import { BaseRepository } from '../../core/base/base.repository.js';
import { RecordModel } from './record.model.js';

export class RecordRepository extends BaseRepository {
  constructor(model = RecordModel) {
    super(model);
  }

  findByRecordId(recordId) {
    return this.model.findOne({ recordId }).lean();
  }

  findManyByIds(recordIds, projection) {
    return this.model.find({ recordId: { $in: recordIds } }, projection).lean();
  }

  listByObject(objectId, { status, skip = 0, limit = 25, sort = { createdAt: -1 } } = {}) {
    const filter = { objectId };
    if (status) filter.status = status;
    return Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      this.model.countDocuments(filter),
    ]);
  }

  /** Streamed cursor — the index builder must never load 5k records into one array. */
  cursorByObject(objectId, status) {
    const filter = { objectId };
    if (status) filter.status = status;
    return this.model.find(filter, { recordId: 1, recordJson: 1, _id: 0 }).lean().cursor();
  }

  allActiveIds(objectId) {
    return this.model.distinct('recordId', { objectId, status: 'ACTIVE' });
  }

  countByObject(objectId, status) {
    const filter = { objectId };
    if (status) filter.status = status;
    return this.model.countDocuments(filter);
  }

  updateByRecordId(recordId, update) {
    return this.model.findOneAndUpdate({ recordId }, update, { new: true }).lean();
  }

  /** Reverse-relationship probe: children whose lookup field points at `value`. */
  findByFieldValue(objectId, fieldId, value, { limit = 0, status = 'ACTIVE' } = {}) {
    const q = this.model.find({ objectId, status, [`recordJson.${fieldId}`]: value }).lean();
    return limit ? q.limit(limit) : q;
  }

  countByFieldValue(objectId, fieldId, value, status = 'ACTIVE') {
    return this.model.countDocuments({ objectId, status, [`recordJson.${fieldId}`]: value });
  }

  existsWithFieldValue(objectId, fieldId, value, excludeRecordId = null) {
    const filter = { objectId, [`recordJson.${fieldId}`]: value };
    if (excludeRecordId) filter.recordId = { $ne: excludeRecordId };
    return this.model.exists(filter);
  }

  lastActivityAt(objectId) {
    return this.model.findOne({ objectId }).sort({ updatedAt: -1 }).select('updatedAt').lean();
  }

  totalCount() {
    return this.model.estimatedDocumentCount();
  }

  groupCountByObject() {
    return this.model.aggregate([{ $group: { _id: '$objectId', count: { $sum: 1 } } }]);
  }
}
