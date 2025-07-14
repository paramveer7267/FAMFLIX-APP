import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
const { height } = Dimensions.get("window");

export default function AuthScreen() {
  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../assets/images/app.jpg")}
        resizeMode="cover"
        className="flex-1 justify-end"
      >
        {/* Bottom Overlay Panel with Gradient */}
        <LinearGradient
          colors={["rgba(0,0,0,0.9)", "rgba(0,0,0,0.6)", "transparent"]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 0 }}
          style={{
            height: height * 0.6,
            paddingHorizontal: 22,
            paddingVertical: 30,
          }}
          className="w-full"
        >
          <View className="flex-1 justify-end">
            {/* Logo */}
            <View className="items-center mb-4">
              <Image
                source={require("../assets/images/famflix-logo-wobg.png")}
                className="w-48 h-14"
                resizeMode="contain"
              />
            </View>

            {/* Subtitle */}
            <Text className="text-white text-lg font-semibold text-center mt-2 mb-6">
              All your favorite Movies & TV Shows. All in one place.
            </Text>

            {/* Free Trial Button */}
            <View className="items-center">
              <TouchableOpacity className="bg-blue-500 py-3 w-full rounded-md items-center mb-3">
                <Text className="font-bold text-white">EXPLORE FREE TRIAL</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <View className="items-center">
              <TouchableOpacity
                className="border-2 border-blue-700 py-3 w-full rounded-md items-center mb-3"
                onPress={() => router.push("/(auth)/login")}
              >
                <Text className="font-semibold text-lg text-blue-500">LOG IN</Text>
              </TouchableOpacity>
            </View>

            {/* Create Account */}
            <View className="flex-row justify-center items-center mt-2">
              <Text className="text-orange-500">or </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text className="text-blue-500 font-semibold">
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
