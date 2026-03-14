import React from "react";
import NoteCard from "./NoteCard";

const NotesList = ({ notes, onDelete }) => {
  return (
    <div>
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default NotesList;