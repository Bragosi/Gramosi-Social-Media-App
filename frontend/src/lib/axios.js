import axios from "axios";

const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/v1"
    : "https://gramosi-social-media-app-2.onrender.com/api/v1";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
