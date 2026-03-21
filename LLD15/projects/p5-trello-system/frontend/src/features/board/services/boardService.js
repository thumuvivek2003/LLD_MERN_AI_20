import api from "../../../services/apiClient";

export const getBoards = async () => {
  const res = await api.get("/boards");
  return res.data;
};

export const getBoard = async (id) => {
  const res = await api.get(`/boards/${id}`);
  return res.data;
};

export const createBoard = async (data) => {
  const res = await api.post("/boards", data);
  return res.data;
};

export const deleteBoard = async (id) => {
  const res = await api.delete(`/boards/${id}`);
  return res.data;
};


export const getBoardListCards = async (id) => {
  const res = await api.get(`/boards/all/${id}`);
  return res.data;
};

