import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { useAuthUserStore } from "@/store/authUser";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Genre from "@/components/Genre";

const screenHeight = Dimensions.get("window").height;

const Movie = () => {
  const { logout } = useAuthUserStore();

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <FlatList
        data={[]} // just to make it scrollable
        renderItem={null}
        ListHeaderComponent={
          <>
            {/* Banner Section */}
            <View style={{ height: screenHeight * 0.6 }}>
              <ImageBackground
                source={require("../../assets/images/app.jpg")}
                resizeMode="cover"
                style={{ flex: 1 }}
              >
                {/* Overlay */}
                <LinearGradient
                  colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.1)", "transparent"]}
                  start={{ x: 0.5, y: 0.1 }}
                  end={{ x: 0.5, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                >
                  {/* Top Nav */}
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

                    <TouchableOpacity
                      onPress={() => router.push("/(modals)/search")}
                    >
                      <Search size={26} color="white" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </View>

            {/* Genre Heading */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                Genre
              </Text>
            </View>
          </>
        }
        ListFooterComponent={<Genre />}
        contentContainerStyle={{
          backgroundColor: "black", // ensures full bg coverage
          paddingBottom: 60,
        }}
        style={{
          flex: 1,
          backgroundColor: "black", // fallback
        }}
      />
    </View>
  );
};

export default Movie;
