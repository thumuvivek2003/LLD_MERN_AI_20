import { downloadFile } from "../../services/fileService";

function DownloadButton({ id }) {
  return (
    <button onClick={() => downloadFile(id)}>
      Download
    </button>
  );
}

export default DownloadButton;