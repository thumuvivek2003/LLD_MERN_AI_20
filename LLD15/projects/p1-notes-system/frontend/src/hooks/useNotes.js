import { useEffect, useState } from "react";
import { getNotes } from "../services/noteService";

const useNotes = () => {

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    getNotes().then((res) => {
      setNotes(res.data);
    });
  }, []);

  return notes;
};

export default useNotes;