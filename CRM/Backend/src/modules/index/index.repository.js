import { BaseRepository } from '../../core/base/base.repository.js';
import { IndexDefinitionModel } from './index.model.js';
import { IndexEntryModel } from './index-entry.model.js';

export class IndexRepository extends BaseRepository {
  constructor(model = IndexDefinitionModel) {
    super(model);
  }

  findByIndexId(indexId) {
    return this.model.findOne({ indexId }).lean();
  }

  findByField(objectId, fieldId) {
    return this.model.findOne({ objectId, fieldId }).lean();
  }

  findAll(filter = {}) {
    return this.model.find(filter).sort({ objectId: 1, fieldId: 1 }).lean();
  }

  updateByIndexId(indexId, update) {
    return this.model.findOneAndUpdate({ indexId }, update, { new: true }).lean();
  }

  deleteByIndexId(indexId) {
    return this.model.findOneAndDelete({ indexId }).lean();
  }

  summary() {
    return this.model.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]);
  }
}

export class IndexEntryRepository extends BaseRepository {
  constructor(model = IndexEntryModel) {
    super(model);
  }

  findByIndexId(indexId) {
    return this.model.find({ indexId }, { key: 1, recordIds: 1, _id: 0 }).lean();
  }

  findAllGrouped() {
    return this.model.find({}, { indexId: 1, key: 1, recordIds: 1, _id: 0 }).lean().cursor();
  }

  replaceForIndex(indexId, rows) {
    return this.model
      .deleteMany({ indexId })
      .then(() => (rows.length ? this.model.insertMany(rows, { ordered: false }) : []));
  }

  deleteForIndex(indexId) {
    return this.model.deleteMany({ indexId });
  }

  /** Incremental maintenance: one upsert per touched key. */
  upsertKeys(ops) {
    return ops.length ? this.model.bulkWrite(ops, { ordered: false }) : null;
  }

  totalEntries() {
    return this.model.estimatedDocumentCount();
  }
}
