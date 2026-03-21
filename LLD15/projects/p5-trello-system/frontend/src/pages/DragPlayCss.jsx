import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── Initial Data ───────────────────────────────────────────────────────────

const INITIAL_LISTS = [
  {
    id: "list-1",
    title: "🔥 Backlog",
    color: "#FF6B6B",
    cards: [
      { id: "c-1", title: "Research competitors", tag: "Research" },
      { id: "c-2", title: "Define user personas", tag: "UX" },
      { id: "c-3", title: "Sketch wireframes", tag: "Design" },
      { id: "c-4", title: "Setup monorepo", tag: "Eng" },
      { id: "c-5", title: "Write PRD v1", tag: "PM" },
    ],
  },
  {
    id: "list-2",
    title: "⚡ In Sprint",
    color: "#FFD93D",
    cards: [
      { id: "c-6", title: "Auth flow implementation", tag: "Eng" },
      { id: "c-7", title: "Design system tokens", tag: "Design" },
      { id: "c-8", title: "API schema design", tag: "Eng" },
      { id: "c-9", title: "Onboarding copy", tag: "Content" },
      { id: "c-10", title: "Analytics integration", tag: "Eng" },
    ],
  },
  {
    id: "list-3",
    title: "🔨 In Progress",
    color: "#6BCB77",
    cards: [
      { id: "c-11", title: "Dashboard UI", tag: "Design" },
      { id: "c-12", title: "Notification service", tag: "Eng" },
      { id: "c-13", title: "Payment gateway", tag: "Eng" },
      { id: "c-14", title: "User profile page", tag: "UX" },
      { id: "c-15", title: "Mobile responsive nav", tag: "Design" },
    ],
  },
  {
    id: "list-4",
    title: "🔍 Review",
    color: "#4D96FF",
    cards: [
      { id: "c-16", title: "Code review: auth", tag: "Eng" },
      { id: "c-17", title: "QA: checkout flow", tag: "QA" },
      { id: "c-18", title: "Stakeholder demo prep", tag: "PM" },
      { id: "c-19", title: "A11y audit", tag: "QA" },
      { id: "c-20", title: "Load testing", tag: "Eng" },
    ],
  },
  {
    id: "list-5",
    title: "✅ Done",
    color: "#C77DFF",
    cards: [
      { id: "c-21", title: "Project kickoff", tag: "PM" },
      { id: "c-22", title: "Repo structure", tag: "Eng" },
      { id: "c-23", title: "Brand guidelines", tag: "Design" },
      { id: "c-24", title: "CI/CD pipeline", tag: "Eng" },
      { id: "c-25", title: "Sprint 0 planning", tag: "PM" },
    ],
  },
];

const TAG_COLORS = {
  Research: "#FF6B6B22",
  UX: "#FFD93D22",
  Design: "#6BCB7722",
  Eng: "#4D96FF22",
  PM: "#C77DFF22",
  Content: "#FF9F4322",
  QA: "#00C9A722",
};

const TAG_TEXT = {
  Research: "#FF6B6B",
  UX: "#c9a000",
  Design: "#3aab4a",
  Eng: "#4D96FF",
  PM: "#C77DFF",
  Content: "#FF9F43",
  QA: "#00C9A7",
};

// ─── Card Component ──────────────────────────────────────────────────────────

function SortableCard({ card, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: localDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: localDragging ? 0.35 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="kanban-card"
    >
      <CardContent card={card} />
    </div>
  );
}

function CardContent({ card }) {
  return (
    <>
      <span
        className="card-tag"
        style={{
          background: TAG_COLORS[card.tag] || "#ffffff11",
          color: TAG_TEXT[card.tag] || "#aaa",
        }}
      >
        {card.tag}
      </span>
      <p className="card-title">{card.title}</p>
      <div className="card-footer">
        <span className="drag-hint">⠿ drag</span>
      </div>
    </>
  );
}

// ─── List Component ──────────────────────────────────────────────────────────

function KanbanList({ list }) {
  return (
    <div className="kanban-list">
      <div className="list-header" style={{ borderTopColor: list.color }}>
        <span className="list-title">{list.title}</span>
        <span className="list-count" style={{ color: list.color }}>
          {list.cards.length}
        </span>
      </div>
      <SortableContext
        items={list.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="card-stack">
          {list.cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

// ─── Main Board ──────────────────────────────────────────────────────────────

export default function DragPlay5x5() {
  const [lists, setLists] = useState(INITIAL_LISTS);
  const [activeCard, setActiveCard] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Find which list a card belongs to
  const findListByCardId = (cardId) =>
    lists.find((l) => l.cards.some((c) => c.id === cardId));

  const findListById = (listId) => lists.find((l) => l.id === listId);

  function handleDragStart({ active }) {
    const list = findListByCardId(active.id);
    if (list) {
      setActiveCard(list.cards.find((c) => c.id === active.id));
    }
  }

  function handleDragOver({ active, over }) {
    if (!over) return;

    const activeList = findListByCardId(active.id);
    const overList =
      findListByCardId(over.id) || findListById(over.id);

    if (!activeList || !overList || activeList.id === overList.id) return;

    setLists((prev) => {
      const activeCards = [...activeList.cards];
      const overCards = [...overList.cards];

      const activeIdx = activeCards.findIndex((c) => c.id === active.id);
      const overIdx = overCards.findIndex((c) => c.id === over.id);

      const [moved] = activeCards.splice(activeIdx, 1);
      const insertAt = overIdx >= 0 ? overIdx : overCards.length;
      overCards.splice(insertAt, 0, moved);

      return prev.map((l) => {
        if (l.id === activeList.id) return { ...l, cards: activeCards };
        if (l.id === overList.id) return { ...l, cards: overCards };
        return l;
      });
    });
  }

  function handleDragEnd({ active, over }) {
    setActiveCard(null);
    if (!over) return;

    const activeList = findListByCardId(active.id);
    const overList =
      findListByCardId(over.id) || findListById(over.id);

    if (!activeList || !overList) return;

    if (activeList.id === overList.id) {
      const cards = activeList.cards;
      const from = cards.findIndex((c) => c.id === active.id);
      const to = cards.findIndex((c) => c.id === over.id);
      if (from !== to) {
        setLists((prev) =>
          prev.map((l) =>
            l.id === activeList.id
              ? { ...l, cards: arrayMove(l.cards, from, to) }
              : l
          )
        );
      }
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0e0e12;
          min-height: 100vh;
          font-family: 'Syne', sans-serif;
        }

        .board-wrapper {
          min-height: 100vh;
          background: #0e0e12;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, #1a1a2e 0%, transparent 60%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 39px,
              #ffffff04 39px,
              #ffffff04 40px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 39px,
              #ffffff04 39px,
              #ffffff04 40px
            );
          padding: 32px 24px 48px;
        }

        .board-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .board-header h1 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #f0f0f0;
          letter-spacing: -0.5px;
        }

        .board-header h1 span {
          background: linear-gradient(90deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #C77DFF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .board-header p {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: #555;
          margin-top: 6px;
          letter-spacing: 0.05em;
        }

        .board-scroll {
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .board-columns {
          display: flex;
          gap: 16px;
          min-width: max-content;
          align-items: flex-start;
        }

        .kanban-list {
          width: 240px;
          background: #16161e;
          border: 1px solid #ffffff0a;
          border-radius: 14px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px 12px;
          border-top: 3px solid;
          background: #1c1c26;
        }

        .list-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #e0e0e0;
          letter-spacing: 0.02em;
        }

        .list-count {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          font-weight: 500;
          background: #ffffff0a;
          border-radius: 20px;
          padding: 2px 8px;
        }

        .card-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          min-height: 60px;
        }

        .kanban-card {
          background: #1f1f2b;
          border: 1px solid #ffffff0d;
          border-radius: 10px;
          padding: 12px 13px 10px;
          cursor: grab;
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
          user-select: none;
        }

        .kanban-card:hover {
          border-color: #ffffff22;
          box-shadow: 0 4px 20px #00000055;
          transform: translateY(-1px);
        }

        .kanban-card:active {
          cursor: grabbing;
        }

        .card-tag {
          display: inline-block;
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 20px;
          letter-spacing: 0.04em;
          margin-bottom: 7px;
        }

        .card-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: #d8d8e0;
          line-height: 1.4;
        }

        .card-footer {
          margin-top: 9px;
          display: flex;
          justify-content: flex-end;
        }

        .drag-hint {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem;
          color: #333;
          letter-spacing: 0.06em;
        }

        /* Drag Overlay */
        .drag-overlay-card {
          background: #2a2a3a;
          border: 1.5px solid #ffffff28;
          border-radius: 10px;
          padding: 12px 13px 10px;
          box-shadow: 0 16px 48px #00000088, 0 0 0 1px #ffffff08;
          transform: rotate(2deg) scale(1.04);
          pointer-events: none;
          width: 230px;
        }
      `}</style>

      <div className="board-wrapper">
        <div className="board-header">
          <h1><span>DragPlay 5×5</span> Board</h1>
          <p>5 lists · 25 cards · drag anywhere</p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="board-scroll">
            <div className="board-columns">
              {lists.map((list) => (
                <KanbanList key={list.id} list={list} />
              ))}
            </div>
          </div>

          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeCard ? (
              <div className="drag-overlay-card">
                <CardContent card={activeCard} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}