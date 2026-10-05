// utils/api.js
import axios from "axios";

const token = localStorage.getItem("token"); // ya session

const API = axios.create({
  baseURL: "https://pick4u-yyco.onrender.com/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export default API;
