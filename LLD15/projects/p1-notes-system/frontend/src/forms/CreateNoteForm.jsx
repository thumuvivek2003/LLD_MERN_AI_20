import React, { useState } from "react";
import { createNote } from "../services/noteService";

const CreateNoteForm = ({ refreshNotes }) => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        await createNote({ title, content });

        setTitle("");
        setContent("");

        refreshNotes();
    };

    return (
        <form onSubmit={handleSubmit} style={{marginTop:8}}>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />

            <button type="submit">
                Create Note
            </button>

        </form>
    );
};

export default CreateNoteForm;