import { deleteFile } from "../../services/fileService";

function DeleteButton({ id, refresh }) {

  const handleDelete = async () => {
    await deleteFile(id);
    refresh();
  };

  return (
    <button onClick={handleDelete}>
      Delete
    </button>
  );
}

export default DeleteButton;