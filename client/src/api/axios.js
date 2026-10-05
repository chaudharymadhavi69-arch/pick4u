// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://pick4u-yyco.onrender.com/api",
});

// 🔹 Automatically attach token if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token"); // or sessionStorage
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
