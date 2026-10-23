import noteRepository from "../repositories/noteRepository.js";

class NoteService {

  async createNote(data) {
    return await noteRepository.create(data);
  }

  async getAllNotes() {
    return await noteRepository.findAll();
  }

  async getNoteById(id) {
    return await noteRepository.findById(id);
  }

  async updateNote(id, data) {
    return await noteRepository.update(id, data);
  }

  async deleteNote(id) {
    return await noteRepository.delete(id);
  }

}

export default new NoteService();