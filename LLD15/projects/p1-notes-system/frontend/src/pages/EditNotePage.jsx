import React from "react";
import { Link } from "react-router-dom";
import EditNoteForm from "../forms/EditNoteForm";

const EditNotePage = () => {
  return (
    <main className="page-content edit-page">
      <Link to="/" className="edit-page__back">
        ← Back to Notes
      </Link>

      <header className="page-header">
        <p className="page-header__eyebrow">Editing</p>
        <h1 className="page-header__title">Update Note</h1>
      </header>

      <EditNoteForm />
    </main>
  );
};

export default EditNotePage;