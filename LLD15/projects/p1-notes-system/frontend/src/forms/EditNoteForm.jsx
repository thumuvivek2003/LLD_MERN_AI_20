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
        <form onSubmit={handleSubmit}>

            {error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                    {error}
                </div>
            )}

            <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <button type="submit">
                Update Note
            </button>

        </form>
    );
};

export default EditNoteForm;