import DownloadButton from "../FileActions/DownloadButton";
import DeleteButton from "../FileActions/DeleteButton";

function FileItem({ file, refresh }) {
  return (
    <div style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
      <p>{file.fileName}</p>

      <DownloadButton id={file._id} />

      <DeleteButton id={file._id} refresh={refresh} />
    </div>
  );
}

export default FileItem;