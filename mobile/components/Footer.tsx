import React from "react";
import { View, Text } from "react-native";
import * as Application from "expo-application";

const Footer = () => {
  return (
    <View className="py-6 bg-black items-center justify-center border-t border-gray-800">
      <Text className="text-gray-400 text-sm font-medium">
        © {new Date().getFullYear()} FAMFLIX. All rights reserved.
      </Text>
      <Text className="text-gray-600 text-xs mt-1">
        Built with ❤️ by PvNation
      </Text>
      <Text className="text-gray-500 text-xs mt-1">
        Version {Application.nativeApplicationVersion || "1.0.0"}
      </Text>
    </View>
  );
};

export default Footer;
