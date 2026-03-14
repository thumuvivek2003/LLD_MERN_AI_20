import React, { useEffect, useState } from "react";
import NotesList from "../components/NotesList";
import CreateNoteForm from "../forms/CreateNoteForm";
import { getNotes, deleteNote } from "../services/noteService";

const NotesPage = () => {

  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const res = await getNotes();
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    await deleteNote(id);
    fetchNotes();
  };

  return (
    <div>

      <CreateNoteForm refreshNotes={fetchNotes} />

      <h2>All Notes</h2>

      <NotesList notes={notes} onDelete={handleDelete} />

    </div>
  );
};

export default NotesPage;