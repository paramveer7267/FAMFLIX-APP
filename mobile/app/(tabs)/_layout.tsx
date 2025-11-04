import React, { useRef, useEffect } from "react";
import { Animated, Pressable, Text, Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useIsFocused } from "@react-navigation/native";

const CustomTabButton = ({ onPress, name, label, size = 22 }) => {
  const isFocused = useIsFocused();
  const scale = useRef(new Animated.Value(isFocused ? 1.08 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isFocused ? 1.08 : 1,
      useNativeDriver: true,
      friction: 5,
      tension: 90,
    }).start();
  }, [isFocused]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.12,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: isFocused ? 1.08 : 1,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  // ✅ This now re-renders with proper focus state
  const color = isFocused ? COLORS.primary : COLORS.grey;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      android_ripple={{ color: "#ffffff15", borderless: true }}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: Platform.OS === "android" ? 6 : 8,
      }}
    >
      <Animated.View
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale }],
        }}
      >
        <Ionicons name={name} size={size} color={color} />
        <Text
          style={{
            color,
            fontSize: 11,
            marginTop: 2,
            fontWeight: isFocused ? "600" : "400",
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0,
          height: 56,
          paddingBottom: 6,
        },
      }}
    >
      <Tabs.Screen
        name="movie"
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} name="film-outline" label="Movies" />
          ),
        }}
      />
      <Tabs.Screen
        name="tv"
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} name="tv-outline" label="TV Shows" />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          tabBarButton: (props) => (
            <CustomTabButton
              {...props}
              name="bookmark-outline"
              label="Watch List"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} name="layers-outline" label="Browse" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} name="person-outline" label="Account" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
