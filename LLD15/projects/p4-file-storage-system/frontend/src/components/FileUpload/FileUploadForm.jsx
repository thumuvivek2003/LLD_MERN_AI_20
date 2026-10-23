import { useState } from "react";
import useUpload from "../../hooks/useUpload";

function FileUploadForm() {
  const [file, setFile] = useState(null);
  const { upload, loading } = useUpload();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return;
    console.log('Sending as',file)

    await upload(file);
    alert("File uploaded");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button type="submit" disabled={loading}>
        Upload
      </button>
    </form>
  );
}

export default FileUploadForm;