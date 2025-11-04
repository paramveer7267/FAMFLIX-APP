import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { useAuthUserStore } from "@/store/authUser.js";

export default function LoginScreen() {
  const { login } = useAuthUserStore();

  const [emailorusername, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 🔥 NEW

  async function handleLogin() {
    try {
      if (!emailorusername || !password) {
        Toast.show({ type: "error", text1: "Please fill all fields" });
        return;
      }

      setLoading(true); // Start loader

      await login({ emailorusername, password });
      const userNow = useAuthUserStore.getState().user;

      if (userNow) {
        router.replace("/(tabs)/movie");
      } else {
        Toast.show({ type: "error", text1: "Invalid credentials" });
      }
    } catch (err) {
      console.error("Login Error:", err);
      Toast.show({ type: "error", text1: "Login failed" });
    } finally {
      setLoading(false); // Stop loader
    }
  }

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="p-2 flex flex-row items-center">
        <TouchableOpacity
          onPress={() => router.replace("/")}
          disabled={loading} // disable back press during login
        >
          <X color="white" size={28} />
        </TouchableOpacity>
        <View className="absolute left-0 right-0 items-center">
          <Text className="text-white text-2xl font-bold">Log In</Text>
        </View>
      </View>

      <View className="max-w-xl mx-auto px-4 py-8 my-10">
        <View className="items-center">
          <Image
            source={require("../../assets/images/famflix-logo-wobg.png")}
            className="w-40 h-12"
          />
        </View>

        <View className="min-w-full p-6 gap-y-2 space-y-5">
          <View>
            <Text className="text-gray-300 mb-1 font-medium">
              Email / Username
            </Text>
            <TextInput
              value={emailorusername}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              className="w-full px-3 py-4 rounded-md border border-gray-700 text-white"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-1 font-medium">Password</Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                editable={!loading}
                className="w-full px-3 py-4 rounded-md border border-gray-700 text-white"
              />
              <TouchableOpacity
                disabled={loading}
                className="absolute right-3 top-4"
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Text className="text-gray-400 text-md">
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className={`py-3 rounded-md items-center ${
              loading ? "bg-gray-600" : "bg-blue-500"
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size={23} />
            ) : (
              <Text className="text-white font-semibold text-lg">Log In</Text>
            )}
          </TouchableOpacity>

          <View className="items-center mt-4">
            <Text className="text-gray-400">
              Don't have an Account?{" "}
              <Text
                className="text-blue-400 font-semibold"
                onPress={() => !loading && router.replace("/(auth)/signup")}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
