import React from "react";
import { useNavigate } from "react-router-dom";

const NoteCard = ({ note, onDelete }) => {
  const navigate = useNavigate();

  return (
    <article className="note-card">
      <div className="note-card__header">
        <h3 className="note-card__title">{note.title}</h3>
      </div>

      <p className="note-card__content">{note.content}</p>

      <footer className="note-card__footer">
        <div className="note-card__actions">
          <button
            className="btn btn--ghost"
            onClick={() => navigate(`/edit/${note._id}`)}
          >
            ✏ Edit
          </button>
          <button
            className="btn btn--danger"
            onClick={() => onDelete(note._id)}
          >
            ✕ Delete
          </button>
        </div>
      </footer>
    </article>
  );
};

export default NoteCard;