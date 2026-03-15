import useFiles from "../../hooks/useFiles";
import FileList from "../../components/FileList/FileList";

function FilesPage() {
  const { files, loading, refresh } = useFiles();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Files</h2>

      <FileList files={files} refresh={refresh} />
    </div>
  );
}

export default FilesPage;