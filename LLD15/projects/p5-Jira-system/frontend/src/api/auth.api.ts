import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginApi = (email: string, password: string) =>
  API.post("/users/login", { email, password });

export const registerApi = (name: string, email: string, password: string) =>
  API.post("/users/register", { name, email, password });