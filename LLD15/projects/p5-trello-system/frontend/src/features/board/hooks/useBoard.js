import { useEffect, useState } from "react";
import { getBoard } from "../services/boardService";

export default function useBoard(boardId) {

  const [board, setBoard] = useState(null);

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  async function loadBoard() {
    const data = await getBoard(boardId);
    setBoard(data);
  }

  return { board };
}