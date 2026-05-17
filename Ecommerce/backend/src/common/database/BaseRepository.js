export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(payload) {
    return this.model.create(payload);
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async findOne(filter = {}) {
    return this.model.findOne(filter);
  }

  async find(filter = {}, options = {}) {
    let q = this.model.find(filter);
    if (options.sort) q = q.sort(options.sort);
    if (options.limit) q = q.limit(options.limit);
    return q.exec();
  }

  async update(id, patch) {
    return this.model.findByIdAndUpdate(id, patch, { new: true });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}
