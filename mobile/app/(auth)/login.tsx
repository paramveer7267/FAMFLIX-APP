import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
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

  async function handleLogin() {
    try {
      if (!emailorusername || !password) {
        Toast.show({ type: "error", text1: "Please fill all fields" });
        return;
      }

      await login({ emailorusername, password });
    } catch (err) {
      console.error("Login Error:", err);
      Toast.show({ type: "error", text1: "Login failed" });
    }
  }

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="p-2 flex flex-row items-center">
        <TouchableOpacity onPress={() => router.replace("/")}>
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
                className="w-full px-3 py-4 rounded-md border border-gray-700 text-white"
              />
              <TouchableOpacity
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
            className="bg-blue-500 py-3 rounded-md items-center"
            onPress={handleLogin}
          >
            <Text className="text-white font-semibold text-lg">Log In</Text>
          </TouchableOpacity>

          <View className="items-center mt-4">
            <Text className="text-gray-400">
              Don't have an Account?{" "}
              <Text
                className="text-blue-400 font-semibold"
                onPress={() => router.push("/(auth)/signup")}
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
