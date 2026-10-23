import React from "react";
import NoteCard from "./NoteCard";

const NotesList = ({ notes, onDelete }) => {
  if (!notes || notes.length === 0) {
    return (
      <div className="notes-list__empty">
        <div className="notes-list__empty-icon">📝</div>
        <p>No notes yet. Create your first one above.</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default NotesList;