import { BaseRepository } from '../../core/base/base.repository.js';
import { ObjectDefinitionModel } from './object.model.js';
import { ObjectVersionModel } from './object-version.model.js';

export class ObjectRepository extends BaseRepository {
  constructor(model = ObjectDefinitionModel) {
    super(model);
  }

  findByObjectId(objectId) {
    return this.model.findOne({ objectId }).lean();
  }

  findAll() {
    return this.model.find({}).sort({ label: 1 }).lean();
  }

  search({ q, status, sort = 'label', order = 'asc', skip = 0, limit = 25 }) {
    const filter = {};
    if (status) filter.status = status;
    if (q) filter.$or = [{ label: new RegExp(q, 'i') }, { apiName: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }];
    const sortSpec = { [sort]: order === 'desc' ? -1 : 1 };
    return Promise.all([
      this.model.find(filter).sort(sortSpec).skip(skip).limit(limit).lean(),
      this.model.countDocuments(filter),
    ]);
  }

  updateByObjectId(objectId, update) {
    return this.model.findOneAndUpdate({ objectId }, update, { new: true }).lean();
  }

  deleteByObjectId(objectId) {
    return this.model.findOneAndDelete({ objectId }).lean();
  }

  /** Positional update of one embedded field — needs arrayFilters, so it lives here. */
  updateField(objectId, fieldId, field, updatedBy) {
    return this.model
      .findOneAndUpdate(
        { objectId },
        { $set: { 'fields.$[f]': field, updatedBy } },
        { new: true, arrayFilters: [{ 'f.fieldId': fieldId }] },
      )
      .lean();
  }

  countFields() {
    return this.model.aggregate([{ $project: { n: { $size: '$fields' } } }, { $group: { _id: null, total: { $sum: '$n' } } }]);
  }
}

export class ObjectVersionRepository extends BaseRepository {
  constructor(model = ObjectVersionModel) {
    super(model);
  }

  listForObject(objectId) {
    return this.model.find({ objectId }).sort({ version: -1 }).lean();
  }
}
