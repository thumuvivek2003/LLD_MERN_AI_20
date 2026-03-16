import { useState } from "react";
import { createList } from "../services/listService";

export default function AddList({ boardId, onAdded }) {

  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    if (!title) return;
    await createList(boardId, { title });
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
        + Add another list
      </div>
    );
  }

  return (
    <div style={styles.form}>
      <input
        style={styles.input}
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Enter list title..."
        onKeyDown={e => e.key === "Enter" && handleAdd()}
        autoFocus
      />
      <div style={{ display: "flex", gap: "4px" }}>
        <button style={styles.submitBtn} onClick={handleAdd}>Add List</button>
        <button style={styles.cancelBtn} onClick={() => setAdding(false)}>&times;</button>
      </div>
    </div>
  );
}

const styles = {
  addBtn: {
    minWidth: "272px",
    background: "rgba(255,255,255,0.3)",
    borderRadius: "6px",
    padding: "12px",
    cursor: "pointer",
    color: "#333",
    fontSize: "14px",
    flexShrink: 0,
  },
  form: {
    minWidth: "272px",
    background: "#ebecf0",
    borderRadius: "6px",
    padding: "8px",
    flexShrink: 0,
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "2px solid #0079bf",
    borderRadius: "4px",
    fontSize: "14px",
    marginBottom: "8px",
    boxSizing: "border-box",
    outline: "none",
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
