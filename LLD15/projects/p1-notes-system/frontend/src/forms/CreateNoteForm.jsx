import React, { useState } from "react";
import { createNote } from "../services/noteService";

const CreateNoteForm = ({ refreshNotes }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createNote({ title, content });
    setTitle("");
    setContent("");
    refreshNotes();
  };

  return (
    <div className="note-form">
      <h2 className="note-form__title">New Note</h2>

      <div className="form-group">
        <label className="form-label" htmlFor="note-title">
          Title
        </label>
        <input
          id="note-title"
          className="form-input"
          type="text"
          placeholder="Give your note a title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="note-content">
          Content
        </label>
        <textarea
          id="note-content"
          className="form-textarea"
          placeholder="Write something…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <button className="btn btn--primary btn--full" onClick={handleSubmit}>
        + Add Note
      </button>
    </div>
  );
};

export default CreateNoteForm;