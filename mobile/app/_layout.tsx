import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import Toast from "react-native-toast-message";
export default function RootLayout() {
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
