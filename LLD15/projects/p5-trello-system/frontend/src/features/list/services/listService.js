import api from "../../../services/apiClient";

export const getLists = async (boardId) => {
  const res = await api.get(`/lists/${boardId}`);
  return res.data;
};

export const createList = async (boardId, data) => {
  const res = await api.post(`/lists/${boardId}`, data);
  return res.data;
};

export const updateList = async (id, data) => {
  const res = await api.put(`/lists/update/${id}`, data);
  return res.data;
};

export const deleteList = async (id) => {
  const res = await api.delete(`/lists/delete/${id}`);
  return res.data;
};
