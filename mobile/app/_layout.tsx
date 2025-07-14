import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import Toast from "react-native-toast-message";
import { setBackgroundColorAsync } from "expo-system-ui";
import { useEffect } from "react";
export default function RootLayout() {
  useEffect(() => {
    setBackgroundColorAsync("black");
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// for iphone
{
  /* <Stack.Screen
            name="(modals)/edit-profile"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              gestureDirection: "vertical",
            }}
          /> */
}
