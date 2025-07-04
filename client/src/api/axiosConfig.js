import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Sangat penting untuk mengirim cookie JWT
});

export default api;
