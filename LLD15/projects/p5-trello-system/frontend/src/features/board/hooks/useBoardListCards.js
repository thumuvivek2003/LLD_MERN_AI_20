import { useEffect, useState } from "react";
import { getBoardListCards } from "../services/boardService";

export default function useBoardListCards(boardId) {

    const [data, setData] = useState([]);

    useEffect(() => {
        loadLists();
    }, [boardId]);

    async function loadLists() {
        const data = await getBoardListCards(boardId);
        setData(data);
    }

    return { data, setData }
}