export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  findById(id) {
    return this.model.findById(id);
  }

  findOne(filter) {
    return this.model.findOne(filter);
  }

  find(filter = {}, options = {}) {
    let q = this.model.find(filter);
    if (options.sort) q = q.sort(options.sort);
    if (options.limit) q = q.limit(options.limit);
    if (options.skip) q = q.skip(options.skip);
    if (options.populate) q = q.populate(options.populate);
    return q;
  }

  updateById(id, update) {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}
