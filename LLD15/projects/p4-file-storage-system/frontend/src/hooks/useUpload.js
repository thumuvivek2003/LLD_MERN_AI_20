import { useState } from "react";
import { uploadFile } from "../services/fileService";

export default function useUpload() {
  const [loading, setLoading] = useState(false);

  const upload = async (file) => {
    setLoading(true);

    try {
      await uploadFile(file);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return { upload, loading };
}