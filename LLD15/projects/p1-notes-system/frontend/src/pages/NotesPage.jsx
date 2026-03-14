import React, { useEffect, useState } from "react";
import NotesList from "../components/NotesList";
import CreateNoteForm from "../forms/CreateNoteForm";
import Loader from "../components/Loader";
import { getNotes, deleteNote } from "../services/noteService";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    const res = await getNotes();
    setNotes(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    await deleteNote(id);
    fetchNotes();
  };

  return (
    <main className="page-content">
      <header className="page-header">
        <p className="page-header__eyebrow">Dashboard</p>
        <h1 className="page-header__title">Your Notes</h1>
      </header>

      <CreateNoteForm refreshNotes={fetchNotes} />

      <div className="section-header">
        <span className="section-header__title">All Notes</span>
        <span className="section-header__line" />
        <span className="section-header__count">{notes.length}</span>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <NotesList notes={notes} onDelete={handleDelete} />
      )}
    </main>
  );
};

export default NotesPage;