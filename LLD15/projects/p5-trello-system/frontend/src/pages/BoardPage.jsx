import { useParams } from "react-router-dom";
import BoardHeader from "../features/board/components/BoardHeader";
import List from "../features/list/components/List";
import AddList from "../features/list/components/AddList";
import useLists from "../features/list/hooks/useLists";
import { DndContext } from "@dnd-kit/core";
import DragPlay5x5 from "./DragPlay";
import useBoardListCards from "../features/board/hooks/useBoardListCards";


export default function BoardPage() {

  const { boardId } = useParams();
  const { data, setData } = useBoardListCards(boardId);
  // return <p>{JSON.stringify(data)}</p>
  // function handleDragEnd(event) {
  //   const { active, over } = event;

  //   if (!over) return;

  //   console.log("Card moved", active.id, "to", over.id);
  // }
  function handleDragEnd(event) {

    const { active, over } = event;

    if (!over) return;

    const cardId = active.id;
    const newListId = over.data.current.listId;

    // moveCard(cardId, newListId);
  }
  return <DragPlay5x5 />


  return (
    <DndContext onDragEnd={handleDragEnd}>

      <div>

        <BoardHeader boardId={boardId} />

        <div style={styles.listsContainer}>
          {lists.map(list => (
            <List key={list._id} list={list} onListChanged={loadLists} />
          ))}

          <AddList boardId={boardId} onAdded={loadLists} />
        </div>

      </div>
    </DndContext>
  );
}

const styles = {
  listsContainer: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    overflowX: "auto",
    paddingBottom: "12px",
  },
};
