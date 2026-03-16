import { useState, useEffect } from "react";
import Modal from "../../../components/UI/Modal";
import { updateCard, deleteCard } from "../services/cardService";

export default function CardModal({ card, isOpen, onClose, onUpdated }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (card) {
      setTitle(card.title || "");
      setDescription(card.description || "");
    }
  }, [card]);

  async function handleSave() {
    await updateCard(card._id, { title, description });
    onUpdated();
    onClose();
  }

  async function handleDelete() {
    await deleteCard(card._id);
    onUpdated();
    onClose();
  }

  if (!card) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 style={{ marginTop: 0 }}>Edit Card</h3>

      <div style={{ marginBottom: "12px" }}>
        <label style={styles.label}>Title</label>
        <input
          style={styles.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={styles.label}>Description</label>
        <textarea
          style={styles.textarea}
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button style={styles.saveBtn} onClick={handleSave}>Save</button>
        <button style={styles.deleteBtn} onClick={handleDelete}>Delete</button>
      </div>
    </Modal>
  );
}

const styles = {
  label: {
    display: "block",
    marginBottom: "4px",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    resize: "vertical",
    boxSizing: "border-box",
  },
  saveBtn: {
    background: "#5aac44",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  deleteBtn: {
    background: "#eb5a46",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
