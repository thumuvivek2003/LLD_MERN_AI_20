import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Card({ card, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: card._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div
        style={styles.card}
        onClick={() => onClick(card)}
      >
        <span>{card.title}</span>
        {card.description && <p style={styles.desc}>{card.description}</p>}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "8px 12px",
    marginBottom: "8px",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    cursor: "pointer",
  },
  desc: {
    fontSize: "12px",
    color: "#666",
    margin: "4px 0 0",
  },
};
