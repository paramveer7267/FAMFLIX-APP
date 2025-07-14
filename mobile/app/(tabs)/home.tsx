import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { useAuthUserStore } from "@/store/authUser";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";


const screenHeight = Dimensions.get("window").height;

const Home = () => {
  const { logout } = useAuthUserStore();

  return (
    <ScrollView className="bg-black">
      <View style={{ height: screenHeight * 0.6 }}>
        <ImageBackground
          source={require("../../assets/images/app.jpg")}
          resizeMode="cover"
          style={{ flex: 1 }}
        >
          {/* Gradient Overlay */}
          <LinearGradient
            colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.1)", "transparent"]}
            start={{ x: 0.5, y: 0.1 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              ...StyleSheet.absoluteFillObject,
            }}
          >
            {/* Navbar Row */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 24,
                paddingTop: 10,
              }}
            >
              <Image
                source={require("../../assets/images/logo-icon1.png")}
                style={{ width: 40, height: 42 }}
                resizeMode="contain"
              />

              <TouchableOpacity onPress={() => router.push("/(modals)/search")}>
                <Search size={26} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Banner Text */}
          <View className="px-4 mt-auto pb-4">
            <Text style={{ color: "white", fontSize: 18 }}>dfds</Text>
            <Text style={{ color: "white", fontSize: 18 }}>sddssd</Text>
            <Text style={{ color: "white", fontSize: 18 }}>dscdscf</Text>
            <Text style={{ color: "white", fontSize: 18 }}>dscdscds</Text>
          </View>
        </ImageBackground>
      </View>

      <View className="px-4 py-6">
        <Text className="text-white text-xl font-bold">Home</Text>
      </View>
    </ScrollView>
  );
};

export default Home;
