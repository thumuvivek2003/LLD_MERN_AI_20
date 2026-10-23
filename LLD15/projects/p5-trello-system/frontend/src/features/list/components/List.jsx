import { useState } from "react";
import useCards from "../../card/hooks/useCards";
import Card from "../../card/components/Card";
import AddCard from "../../card/components/AddCard";
import CardModal from "../../card/components/CardModal";
import { updateList, deleteList } from "../services/listService";
import { SortableContext } from "@dnd-kit/sortable";

export default function List({ list, onListChanged }) {

  const { cards, loadCards } = useCards(list._id);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [selectedCard, setSelectedCard] = useState(null);

  async function handleTitleSave() {
    if (title && title !== list.title) {
      await updateList(list._id, { title });
      onListChanged();
    }
    setEditing(false);
  }

  async function handleDelete() {
    await deleteList(list._id);
    onListChanged();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleTitleSave();
    if (e.key === "Escape") {
      setTitle(list.title);
      setEditing(false);
    }
  }

  return (
    <div style={styles.list}>

      <div style={styles.header}>
        {editing ? (
          <input
            style={styles.titleInput}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <h4
            style={styles.title}
            onClick={() => setEditing(true)}
          >
            {list.title}
          </h4>
        )}
        <button style={styles.deleteBtn} onClick={handleDelete}>&times;</button>
      </div>
      <SortableContext items={cards.map(c => c._id)}>
        {cards.map(card => (
          <Card
            key={card._id}
            card={card}
            onClick={setSelectedCard}
          />
        ))}
      </SortableContext>

      <AddCard listId={list._id} onAdded={loadCards} />

      <CardModal
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onUpdated={loadCards}
      />
    </div>
  );
}

const styles = {
  list: {
    width: "272px",
    background: "#ebecf0",
    padding: "8px",
    borderRadius: "6px",
    flexShrink: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  title: {
    margin: 0,
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  titleInput: {
    fontSize: "14px",
    fontWeight: "bold",
    padding: "4px 8px",
    border: "2px solid #0079bf",
    borderRadius: "4px",
    outline: "none",
    flex: 1,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#999",
    padding: "0 4px",
  },
};
