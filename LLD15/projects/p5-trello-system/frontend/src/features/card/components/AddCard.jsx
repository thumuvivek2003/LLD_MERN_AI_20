import { useState } from "react";
import { createCard } from "../services/cardService";

export default function AddCard({ listId, onAdded }) {

  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    if (!title) return;
    await createCard(listId, { title });
    setTitle("");
    setAdding(false);
    onAdded();
  }

  if (!adding) {
    return (
      <div
        style={styles.addBtn}
        onClick={() => setAdding(true)}
      >
        + Add a card
      </div>
    );
  }

  return (
    <div>
      <textarea
        style={styles.textarea}
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Enter a title for this card..."
        onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAdd();
          }
        }}
        autoFocus
        rows={3}
      />
      <div style={{ display: "flex", gap: "4px" }}>
        <button style={styles.submitBtn} onClick={handleAdd}>Add Card</button>
        <button style={styles.cancelBtn} onClick={() => setAdding(false)}>&times;</button>
      </div>
    </div>
  );
}

const styles = {
  addBtn: {
    padding: "6px 8px",
    cursor: "pointer",
    color: "#666",
    fontSize: "14px",
    borderRadius: "4px",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    resize: "none",
    boxSizing: "border-box",
    outline: "none",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  submitBtn: {
    background: "#5aac44",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cancelBtn: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#666",
  },
};
