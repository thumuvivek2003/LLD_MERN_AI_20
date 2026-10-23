import { Link } from "react-router-dom";
import useBoard from "../hooks/useBoard";

export default function BoardHeader({ boardId }) {

  const { board } = useBoard(boardId);

  if (!board) return null;

  return (
    <div style={styles.header}>
      <Link to="/" style={styles.back}>&larr; Boards</Link>
      <h2 style={styles.title}>{board.title}</h2>
    </div>
  );
}

const styles = {
  header: {
    marginBottom: "16px",
  },
  back: {
    color: "#0079bf",
    textDecoration: "none",
    fontSize: "14px",
  },
  title: {
    margin: "4px 0 0",
    color: "#333",
  },
};
