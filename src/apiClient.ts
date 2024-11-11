// src/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.zacht.tech",
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
