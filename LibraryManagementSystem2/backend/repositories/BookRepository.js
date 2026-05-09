import BookModel from '../models/BookModel.js';

export class BookRepository {
  async findById(id) {
    return BookModel.findById(id);
  }

  async create(data) {
    return BookModel.create(data);
  }

  async update(id, data) {
    return BookModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return BookModel.findByIdAndDelete(id);
  }

  async search(query) {
    return BookModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
      ],
    });
  }

  async findAll() {
    return BookModel.find();
  }
}
