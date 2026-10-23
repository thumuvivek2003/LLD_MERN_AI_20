import { useEffect, useState } from "react";
import { getBoards, createBoard, deleteBoard } from "../features/board/services/boardService";
import { Link } from "react-router-dom";

export default function DashboardPage() {

  const [boards, setBoards] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadBoards();
  }, []);

  async function loadBoards() {
    const data = await getBoards();
    setBoards(data);
  }

  async function handleCreate() {
    if (!newTitle) return;
    await createBoard({ title: newTitle });
    setNewTitle("");
    setCreating(false);
    loadBoards();
  }

  async function handleDelete(e, id) {
    e.preventDefault();
    e.stopPropagation();
    await deleteBoard(id);
    loadBoards();
  }

  return (
    <div>
      <h2 style={styles.heading}>Your Boards</h2>

      <div style={styles.grid}>
        {boards.map(board => (
          <Link
            key={board._id}
            to={`/board/${board._id}`}
            style={styles.boardCard}
          >
            <span style={styles.boardTitle}>{board.title}</span>
            <button
              style={styles.deleteBtn}
              onClick={(e) => handleDelete(e, board._id)}
            >
              &times;
            </button>
          </Link>
        ))}

        {creating ? (
          <div style={styles.createForm}>
            <input
              style={styles.input}
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Board title..."
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              autoFocus
            />
            <div style={{ display: "flex", gap: "4px" }}>
              <button style={styles.submitBtn} onClick={handleCreate}>Create</button>
              <button style={styles.cancelBtn} onClick={() => setCreating(false)}>&times;</button>
            </div>
          </div>
        ) : (
          <div
            style={styles.newBoardCard}
            onClick={() => setCreating(true)}
          >
            + Create new board
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  heading: {
    marginBottom: "16px",
    color: "#333",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  boardCard: {
    width: "200px",
    height: "100px",
    background: "#0079bf",
    borderRadius: "6px",
    padding: "12px",
    color: "white",
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },
  boardTitle: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  deleteBtn: {
    position: "absolute",
    top: "6px",
    right: "8px",
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.7)",
    fontSize: "18px",
    cursor: "pointer",
  },
  newBoardCard: {
    width: "200px",
    height: "100px",
    background: "rgba(0,0,0,0.05)",
    borderRadius: "6px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "14px",
    color: "#666",
  },
  createForm: {
    width: "200px",
    background: "#ebecf0",
    borderRadius: "6px",
    padding: "12px",
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
