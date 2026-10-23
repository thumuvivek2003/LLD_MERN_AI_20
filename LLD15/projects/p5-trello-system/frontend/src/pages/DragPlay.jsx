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
import useBoardListCards from "../features/board/hooks/useBoardListCards";
import { useParams } from "react-router-dom";


const INITIAL_LISTS = [
    {
        id: "list-1",
        title: "Backlog",
        cards: [
            { id: "c-1", title: "Research competitors" },
            { id: "c-2", title: "Define user personas" },
            { id: "c-3", title: "Sketch wireframes" },
            { id: "c-4", title: "Setup monorepo" },
            { id: "c-5", title: "Write PRD v1" },
        ],
    },
    {
        id: "list-2",
        title: "In Sprint",
        cards: [
            { id: "c-6", title: "Auth flow implementation" },
            { id: "c-7", title: "Design system tokens" },
            { id: "c-8", title: "API schema design" },
            { id: "c-9", title: "Onboarding copy" },
            { id: "c-10", title: "Analytics integration" },
        ],
    },
    {
        id: "list-3",
        title: "In Progress",
        cards: [
            { id: "c-11", title: "Dashboard UI" },
            { id: "c-12", title: "Notification service" },
            { id: "c-13", title: "Payment gateway" },
            { id: "c-14", title: "User profile page" },
            { id: "c-15", title: "Mobile responsive nav" },
        ],
    },
    {
        id: "list-4",
        title: "Review",
        cards: [
            { id: "c-16", title: "Code review: auth" },
            { id: "c-17", title: "QA: checkout flow" },
            { id: "c-18", title: "Stakeholder demo prep" },
            { id: "c-19", title: "Accessibility audit" },
            { id: "c-20", title: "Load testing" },
        ],
    },
    {
        id: "list-5",
        title: "Done",
        cards: [
            { id: "c-21", title: "Project kickoff" },
            { id: "c-22", title: "Repo structure" },
            { id: "c-23", title: "Brand guidelines" },
            { id: "c-24", title: "CI/CD pipeline" },
            { id: "c-25", title: "Sprint 0 planning" },
        ],
    },
];

function SortableCard({ card }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="card">
            {card.title}
        </div>
    );
}

function KanbanList({ list }) {
    return (
        <div className="list">
            <div className="list-header">
                <strong>{list.title}</strong>
                <span className="badge">{list.cards.length}</span>
            </div>
            <SortableContext items={list.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                <div className="card-stack">
                    {list.cards.map((card) => (
                        <SortableCard key={card.id} card={card} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}

export default function DragPlay5x5() {
    const { boardId } = useParams();
    const { data: lists, setData: setLists } = useBoardListCards(boardId);
    const [activeCard, setActiveCard] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const findListByCardId = (cardId) =>
        lists.find((l) => l.cards.some((c) => c.id === cardId));

    const findListById = (listId) => lists.find((l) => l.id === listId);

    function handleDragStart({ active }) {
        const list = findListByCardId(active.id);
        if (list) setActiveCard(list.cards.find((c) => c.id === active.id));
    }

    function handleDragOver({ active, over }) {
        if (!over) return;
        const activeList = findListByCardId(active.id);
        const overList = findListByCardId(over.id) || findListById(over.id);
        if (!activeList || !overList || activeList.id === overList.id) return;

        setLists((prev) => {
            const activeCards = [...activeList.cards];
            const overCards = [...overList.cards];
            const activeIdx = activeCards.findIndex((c) => c.id === active.id);
            const overIdx = overCards.findIndex((c) => c.id === over.id);
            const [moved] = activeCards.splice(activeIdx, 1);
            overCards.splice(overIdx >= 0 ? overIdx : overCards.length, 0, moved);
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
        if (!activeList) return;
        const from = activeList.cards.findIndex((c) => c.id === active.id);
        const to = activeList.cards.findIndex((c) => c.id === over.id);
        if (from !== -1 && to !== -1 && from !== to) {
            setLists((prev) =>
                prev.map((l) =>
                    l.id === activeList.id ? { ...l, cards: arrayMove(l.cards, from, to) } : l
                )
            );
        }
    }

    return (
        <>
            <style>{`
        body { font-family: sans-serif; background: #f4f5f7; margin: 0; }
        .board { padding: 24px; overflow-x: auto; }
        .board h1 { font-size: 1.2rem; margin-bottom: 20px; color: #333; }
        .columns { display: flex; gap: 12px; align-items: flex-start; }
        .list { background: #ebecf0; border-radius: 8px; width: 200px; flex-shrink: 0; padding: 10px; }
        .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .list-header strong { font-size: 0.85rem; color: #333; }
        .badge { background: #ddd; border-radius: 10px; padding: 1px 7px; font-size: 0.75rem; color: #555; }
        .card-stack { display: flex; flex-direction: column; gap: 6px; min-height: 40px; }
        .card { background: #fff; border-radius: 4px; padding: 8px 10px; font-size: 0.82rem; color: #333; cursor: grab; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
        .card:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.18); }
        .overlay-card { background: #fff; border-radius: 4px; padding: 8px 10px; font-size: 0.82rem; color: #333; width: 200px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); rotate: 2deg; }
      `}</style>

            <div className="board">
                <h1>DragPlay 5×5</h1>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="columns">
                        {lists.map((list) => (
                            <KanbanList key={list.id} list={list} />
                        ))}
                    </div>
                    <DragOverlay>
                        {activeCard ? <div className="overlay-card">{activeCard.title}</div> : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </>
    );
}