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

  findAll(filter = {}) {
    return this.model.find(filter);
  }

  updateById(id, update) {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  deleteMany(filter = {}) {
    return this.model.deleteMany(filter);
  }
}
