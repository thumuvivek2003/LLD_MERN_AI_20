import axiosClient from "../api/axiosClient";

export const signup = async (data) => {
  const response = await axiosClient.post("/auth/signup", data);
  return response.data;
};

export const login = async (data) => {
  const response = await axiosClient.post("/auth/login", data);
  return response.data;
};