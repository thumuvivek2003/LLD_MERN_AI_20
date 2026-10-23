import React, { useEffect, useState } from "react";
import { getNoteById, updateNote } from "../services/noteService";
import { useParams, useNavigate } from "react-router-dom";

const EditNoteForm = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchNote = async () => {
            try {
                const res = await getNoteById(id);
                setTitle(res.data.title);
                setContent(res.data.content);
            } catch (err) {
                setError("Failed to load note. Please try again.");
            }
        };

        fetchNote();

    }, [id]);

    const handleSubmit = async (e) => {
        if (!title || !content) {
            setError("Please ensure both fields must be filled");
            return;
        }

        e.preventDefault();

        try {
            await updateNote(id, { title, content });
            navigate("/");
        } catch (err) {
            setError("Failed to update note. Please try again.");
        }

    };

   return (
  <form className="note-form" onSubmit={handleSubmit}>
    <h2 className="note-form__title">Update Note</h2>

    {error && (
      <div style={{ color: "red", marginBottom: "10px" }}>
        {error}
      </div>
    )}

    <div className="form-group">
      <label className="form-label" htmlFor="note-title">
        Title
      </label>

      <input
        id="note-title"
        className="form-input"
        type="text"
        placeholder="Give your note a title…"
        required
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
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>

    <button type="submit" className="btn btn--primary btn--full">
      Update Note
    </button>
  </form>
);
};

export default EditNoteForm;