import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getInsurers = async () => {
  const { data } = await api.get("/api/insurers");
  return Array.isArray(data) ? data : [];
};
