export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  findById(id, projection) {
    return this.model.findById(id, projection);
  }

  findOne(filter = {}, projection) {
    return this.model.findOne(filter, projection);
  }

  findAll(filter = {}, options = {}) {
    return this.model.find(filter, options.projection || null, options);
  }

  updateById(id, update) {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }
}
