import axios from "axios";
import { Platform } from "react-native";

// const LOCAL_IP = "https://famflix-app.onrender.com"; // Your dev machine IP
// const PORT = 5000;

const baseURL =
  Platform.OS === "web"
    ? `https://famflix-app.onrender.com` // Only for web preview in browser
    : `https://famflix-app.onrender.com`; // For physical devices & Expo Go

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
