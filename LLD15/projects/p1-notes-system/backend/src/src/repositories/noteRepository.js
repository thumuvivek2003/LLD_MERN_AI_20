import Note from "../models/noteModel.js";

class NoteRepository {

  async create(note) {
    return await Note.create(note);
  }

  async findAll() {
    return await Note.find();
  }

  async findById(id) {
    return await Note.findById(id);
  }

  async update(id, data) {
    return await Note.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Note.findByIdAndDelete(id);
  }

}

export default new NoteRepository();