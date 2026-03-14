import React from "react";
import { useNavigate } from "react-router-dom";

const NoteCard = ({ note, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.card}>
      <h3>{note.title}</h3>
      <p>{note.content}</p>

      <button onClick={() => navigate(`/edit/${note._id}`)}>
        Edit
      </button>

      <button onClick={() => onDelete(note._id)}>
        Delete
      </button>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "10px"
  }
};

export default NoteCard;