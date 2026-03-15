import { useEffect, useState } from "react";
import { getFiles } from "../services/fileService";

export default function useFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      const data = await getFiles();
      setFiles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return { files, loading, refresh: fetchFiles };
}