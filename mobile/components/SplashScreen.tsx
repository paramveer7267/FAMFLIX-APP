import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";

export default function SplashScreen() {
  const bounceScale = useRef(new Animated.Value(0)).current;
  const slideXMain = useRef(new Animated.Value(300)).current; // Full logo from right
  const slideXFirst = useRef(new Animated.Value(0)).current;  // F logo to the left
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const firstOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Step 1 → Bounce animation for the single "F"
    Animated.spring(bounceScale, {
      toValue: 1,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start(() => {

      // Step 2 → Full logo slides in from right & F slides to the left
      Animated.parallel([
        Animated.timing(slideXMain, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(slideXFirst, {
          toValue: -96,  // Move F to the LEFT
          duration: 650,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {

        // Step 3 → Fade out F after both reach center
        Animated.timing(firstOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();

      });

    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >

      {/* FIRST IMAGE — Big F */}
      <Animated.Image
        source={require("@/assets/images/favicon-famflix.png")}
        style={{
          width: 80,
          height: 80,
          resizeMode: "contain",
          position: "absolute",
          opacity: firstOpacity,
          transform: [
            { scale: bounceScale },
            { translateX: slideXFirst }
          ],
        }}
      />

      {/* SECOND IMAGE — Full FAMFLIX */}
      <Animated.Image
        source={require("@/assets/images/famflix-logo-wobg.png")}
        style={{
          width: 230,
          height: 70,
          resizeMode: "contain",
          opacity: logoOpacity,
          transform: [{ translateX: slideXMain }],
        }}
      />
    </View>
  );
}
