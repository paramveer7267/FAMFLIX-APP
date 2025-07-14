import Toast from "react-native-toast-message";
import { create } from "zustand";
import axios from "../utils/axiosInstance.js";
import { router } from "expo-router";
export const useAuthUserStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  isLoggingIn: false,
  online: false,

  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post("/api/v1/auth/signup", credentials, {
        withCredentials: true,
      });
      set({ user: res.data.user, isSigningUp: false });
      Toast.show({
        type: "success",
        text1: "Account created successfully",
        position: "top",
        topOffset: 60,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Something went wrong",
      });
      set({ user: null, isSigningUp: false });
    }
  },

  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const res = await axios.post("/api/v1/auth/login", credentials, {
        withCredentials: true,
      });
      set({ user: res.data.user, isLoggingIn: false });
      Toast.show({
        type: "success",
        text1: "Logged in successfully",
      });
      router.replace("/(tabs)/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Login failed",
      });
      set({ user: null, isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axios.post("/api/v1/auth/logout");
      set({ user: null, isLoggingOut: false });
      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });
      router.replace("/(auth)/login");
    } catch (error) {
      set({ user: null, isLoggingOut: false });
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Logout failed",
      });
    }
  },

  updateWatchList: (newItem) =>
    set((state) => ({
      user: {
        ...state.user,
        watchList: [...(state.user?.watchList || []), newItem],
      },
    })),

  removeFromWatchList: (itemId) =>
    set((state) => ({
      user: {
        ...state.user,
        watchList:
          state.user?.watchList?.filter((item) => item.id !== itemId) || [],
      },
    })),

  updateInfo: async ({ avatar, username, email }) => {
    const promise = axios.post("/api/v1/user/updateInfo", {
      avatar,
      username,
      email,
    });

    Toast.show({
      type: "info",
      text1: "Updating profile...",
    });

    try {
      await promise;
      set((state) => ({
        user: {
          ...state.user,
          image: avatar,
          username,
          email,
        },
      }));
      Toast.show({
        type: "success",
        text1: "Profile updated successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Failed to update profile",
      });
    }
  },

  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get("/api/v1/auth/authCheck");
      set({ user: res.data.user, isCheckingAuth: false });
      set({ online: true });
    } catch {
      set({ user: null, isCheckingAuth: false });
      // No toast here on purpose
    }
  },
}));
