import { useEffect, useState } from "react";
import * as cardService from "../services/cardService";

export default function useCards(listId) {

  const [cards, setCards] = useState([]);

  useEffect(() => {
    loadCards();
  }, [listId]);

  async function loadCards() {
    const data = await cardService.getCards(listId);
    setCards(data);
  }

  return {
    cards,
    loadCards
  };
}