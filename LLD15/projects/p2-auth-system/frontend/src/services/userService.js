import axiosClient from "../api/axiosClient";

export const getUsers = async () => {
  const response = await axiosClient.get("/users/");
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosClient.delete(`/users/${id}`);
  return response.data;
};


export const createUser = async (data) => {
  const res = await axiosClient.post("/users", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await axiosClient.put(`/users/${id}`, data);
  return res.data;
};


export const getProfile = async (data) => {
  const res = await axiosClient.post("/users/profile", data);
  return res.data;
};

