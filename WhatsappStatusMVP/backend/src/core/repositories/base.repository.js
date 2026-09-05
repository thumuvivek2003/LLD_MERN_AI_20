// core/repositories/base.repository.js — Repository Pattern base class.
// Isolates raw Mongoose calls so services never touch the ODM directly.
// Concrete repositories extend this and add domain-specific queries.
export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(doc) {
    return this.model.create(doc);
  }

  findById(id) {
    return this.model.findById(id).lean();
  }

  findOne(filter) {
    return this.model.findOne(filter).lean();
  }

  find(filter = {}) {
    return this.model.find(filter).lean();
  }

  updateById(id, update) {
    return this.model.findByIdAndUpdate(id, update, { new: true }).lean();
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }
}
