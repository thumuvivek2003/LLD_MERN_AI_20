import api from "../../../services/apiClient";

export const getCards = async (listId) => {
  const res = await api.get(`/cards/${listId}`);
  return res.data;
};

export const createCard = async (listId, data) => {
  const res = await api.post(`/cards/${listId}`, data);
  return res.data;
};

export const updateCard = async (id, data) => {
  const res = await api.put(`/cards/update/${id}`, data);
  return res.data;
};

export const deleteCard = async (id) => {
  const res = await api.delete(`/cards/delete/${id}`);
  return res.data;
};
