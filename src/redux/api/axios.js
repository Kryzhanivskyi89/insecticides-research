import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3005",
  // baseURL: "https://insecticides-research-backend.onrender.com",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;