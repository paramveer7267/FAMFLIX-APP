import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import AuthScreen from "@/components/AuthScreen";
import { useAuthUserStore } from "@/store/authUser";
import { COLORS } from "@/constants/theme";
export default function Index() {
  const router = useRouter();
  const { user, isCheckingAuth, authCheck } = useAuthUserStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  useEffect(() => {
    if (!isCheckingAuth && user) {
      // imperatively replace screen — no white flash
      router.replace("/(tabs)/movie");
    }
  }, [isCheckingAuth, user]);

  if (isCheckingAuth) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // while redirecting, keep black background to avoid flash
  if (user) {
    return <View className="flex-1 bg-black" />;
  }

  return <AuthScreen />;
}

// bg-[#1F2937] for cards
