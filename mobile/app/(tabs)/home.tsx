import { View, Text } from "react-native";
import React from "react";
import { useAuthUserStore } from "@/store/authUser";
import { router } from "expo-router";
const Home = () => {
  const { logout } = useAuthUserStore();

  return (
    <View>
      <Text>Home</Text>
      <Text onPress={() => logout()}>LogOut</Text>
    </View>
  );
};

export default Home;
