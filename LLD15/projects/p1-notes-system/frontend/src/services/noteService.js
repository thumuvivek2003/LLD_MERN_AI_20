import axios from "axios";

const API = "http://localhost:5001/notes";

export const getNotes = () => axios.get(API);

export const getNoteById = (id) => axios.get(`${API}/${id}`);

export const createNote = (data) => axios.post(API, data);

export const updateNote = (id, data) =>
  axios.put(`${API}/${id}`, data);

export const deleteNote = (id) =>
  axios.delete(`${API}/${id}`);