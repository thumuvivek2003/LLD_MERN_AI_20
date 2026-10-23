import noteService from "../services/noteService.js";

class NoteController {

  async createNote(req, res, next) {
    try {
      const note = await noteService.createNote(req.body);
      res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  }

  async getNotes(req, res, next) {
    try {
      const notes = await noteService.getAllNotes();
      res.json(notes);
    } catch (err) {
      next(err);
    }
  }

  async getNote(req, res, next) {
    try {
      const note = await noteService.getNoteById(req.params.id);
      res.json(note);
    } catch (err) {
      next(err);
    }
  }

  async updateNote(req, res, next) {
    try {
      const note = await noteService.updateNote(req.params.id, req.body);
      res.json(note);
    } catch (err) {
      next(err);
    }
  }

  async deleteNote(req, res, next) {
    try {
      await noteService.deleteNote(req.params.id);
      res.json({ message: "Note deleted" });
    } catch (err) {
      next(err);
    }
  }

}

export default new NoteController();