import axios from "axios";

export const BASE_URL = "http://localhost:9000/api/v1";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default API;
