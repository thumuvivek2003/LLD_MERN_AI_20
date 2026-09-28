import { IRepository } from '../interfaces/repository.interface.js';

/** Standard projection: Mongo bookkeeping fields never reach the API envelope. */
export const LEAN = { _id: 0, __v: 0 };

/**
 * The ONLY layer allowed to touch a Mongoose model.
 * Services receive repositories through constructor injection (DIP).
 */
export class BaseRepository extends IRepository {
  constructor(model) {
    super();
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  insertMany(docs, options = {}) {
    return this.model.insertMany(docs, { ordered: false, ...options });
  }

  findOne(filter, projection) {
    return this.model.findOne(filter, projection).lean();
  }

  find(filter = {}, options = {}) {
    let q = this.model.find(filter, options.projection);
    if (options.sort) q = q.sort(options.sort);
    if (options.skip) q = q.skip(options.skip);
    if (options.limit) q = q.limit(options.limit);
    return q.lean();
  }

  updateOne(filter, update) {
    return this.model.findOneAndUpdate(filter, update, { new: true }).lean();
  }

  updateMany(filter, update) {
    return this.model.updateMany(filter, update);
  }

  deleteOne(filter) {
    return this.model.findOneAndDelete(filter).lean();
  }

  deleteMany(filter) {
    return this.model.deleteMany(filter);
  }

  count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  distinct(field, filter = {}) {
    return this.model.distinct(field, filter);
  }

  bulkWrite(ops) {
    return this.model.bulkWrite(ops, { ordered: false });
  }

  aggregate(pipeline) {
    return this.model.aggregate(pipeline);
  }
}
