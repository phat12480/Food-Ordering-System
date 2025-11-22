// src/api/apiClient.js
import axios from "axios";

// Với Vite, biến môi trường phải bắt đầu bằng VITE_
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL, // <--- QUAN TRỌNG: dùng biến môi trường
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
