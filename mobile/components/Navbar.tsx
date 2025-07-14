import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Search } from "lucide-react-native";
import { router } from "expo-router";
const Navbar = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 6,
        backgroundColor: "black",
      }}
    >
      <Image
        source={require("../assets/images/logo-icon1.png")}
        style={{ width: 40, height: 42 }}
        resizeMode="contain"
      />

      <TouchableOpacity onPress={() => router.push("/(modals)/search")}>
        <Search size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
