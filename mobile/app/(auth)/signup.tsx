import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";
import { useAuthUserStore } from "@/store/authUser.js";
export default function SignupScreen() {
  const { signup } = useAuthUserStore();
  const { email: emailParam } = useLocalSearchParams();
  const [email, setEmail] = useState(emailParam || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const hiddenRef = useRef<TextInput>(null);
  const visibleRef = useRef<TextInput>(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
    setTimeout(() => {
      (showPassword ? visibleRef : hiddenRef).current?.focus();
    }, 0);
  };
  async function handleSignup() {
    try {
      await signup({ email, username, password });

      const userNow = useAuthUserStore.getState().user;

      if (userNow) {
        router.replace("/(tabs)/home"); // ✅ Redirect after signup
      }
    } catch (error) {
      console.error("Signup failed:", error);
      // Optionally show a Toast here if signup store doesn’t already handle it
    }
  }

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="p-2 flex flex-row items-center relative">
        <TouchableOpacity onPress={() => router.push("/")}>
          <X color="white" size={28} />
        </TouchableOpacity>

        <View className="absolute left-0 right-0 items-center">
          <Text className="text-white text-2xl font-bold">Create Account</Text>
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
          <Text className="text-white text-xl font-bold text-center">
            Sign Up
          </Text>

          <View>
            <Text className="text-gray-300 mb-1 font-medium">Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#999"
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="w-full px-3 py-4 rounded-md border border-gray-700 text-white"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-1 font-medium">Username</Text>
            <TextInput
              placeholder="Enter your username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              className="w-full px-3 py-4 rounded-md border border-gray-700 text-white"
            />
          </View>

          {/* Password Input with two overlapping TextInputs */}
          <View>
            <Text className="text-gray-300 mb-1 font-medium">Password</Text>
            <View className="relative">
              {!showPassword ? (
                <TextInput
                  ref={hiddenRef}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Enter the Password"
                  placeholderTextColor="#999"
                  className="w-full px-3 py-4 rounded-md border border-gray-700 text-white"
                />
              ) : (
                <TextInput
                  ref={visibleRef}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter the Password"
                  placeholderTextColor="#999"
                  className="w-full px-3 py-4 rounded-md border border-gray-700 text-white"
                />
              )}

              <TouchableOpacity
                className="absolute right-3 top-4"
                onPress={togglePasswordVisibility}
              >
                <Text className="text-gray-400 text-md">
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="bg-blue-500 py-3 rounded-md items-center"
            onPress={handleSignup}
          >
            <Text className="text-white font-semibold text-lg">
              Create Account
            </Text>
          </TouchableOpacity>

          <View className="items-center mt-4">
            <Text className="text-gray-400">
              Already a member?{" "}
              <Text
                className="text-blue-400 font-semibold"
                onPress={() => router.push("/(auth)/login")}
              >
                Login
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
