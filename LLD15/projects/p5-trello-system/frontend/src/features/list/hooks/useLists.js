import { useEffect, useState } from "react";
import * as listService from "../services/listService";

export default function useLists(boardId) {

  const [lists, setLists] = useState([]);

  useEffect(() => {
    loadLists();
  }, [boardId]);

  async function loadLists() {
    const data = await listService.getLists(boardId);
    setLists(data);
  }

  return {
    lists,
    loadLists
  };
}