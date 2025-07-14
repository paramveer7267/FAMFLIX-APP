import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import AuthScreen from "@/components/AuthScreen";
import { useAuthUserStore } from "@/store/authUser";

export default function Index() {
  const { user, isCheckingAuth, authCheck } = useAuthUserStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }
  if (user === undefined && !isCheckingAuth) {
    return null;
  }

  return user ? <Redirect href="/(tabs)/home" /> : <AuthScreen />;
}
