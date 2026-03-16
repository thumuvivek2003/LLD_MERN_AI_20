import { useParams } from "react-router-dom";
import BoardHeader from "../features/board/components/BoardHeader";
import List from "../features/list/components/List";
import AddList from "../features/list/components/AddList";
import useLists from "../features/list/hooks/useLists";

export default function BoardPage() {

  const { boardId } = useParams();
  const { lists, loadLists } = useLists(boardId);

  return (
    <div>

      <BoardHeader boardId={boardId} />

      <div style={styles.listsContainer}>
        {lists.map(list => (
          <List key={list._id} list={list} onListChanged={loadLists} />
        ))}

        <AddList boardId={boardId} onAdded={loadLists} />
      </div>

    </div>
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
