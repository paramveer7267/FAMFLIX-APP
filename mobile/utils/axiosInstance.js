import axios from "axios";
import { Platform } from "react-native";

const LOCAL_IP = "192.168.1.12"; // Your dev machine IP
const PORT = 5000;

const baseURL =
  Platform.OS === "web"
    ? `http://localhost:${PORT}` // Only for web preview in browser
    : `http://${LOCAL_IP}:${PORT}`; // For physical devices & Expo Go

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
