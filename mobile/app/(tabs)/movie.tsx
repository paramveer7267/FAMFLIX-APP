import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { Search, Play, Info } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/theme";
import Genre from "@/components/Genre";
import useGetTrendingContent from "@/hooks/useGetTrendingContent";
import api from "@/utils/axiosInstance";

const screenHeight = Dimensions.get("window").height;

// Movie categories (you can adjust or import from constants)
const MOVIE_CATEGORIES = [
  "now_playing",
  "popular",
  "top_rated",
  "upcoming",
];

const Movie = () => {
  const { trendingContent } = useGetTrendingContent();
  const [categoryData, setCategoryData] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responses = await Promise.all(
          MOVIE_CATEGORIES.map((category) =>
            api.get(`/api/v1/movie/${category}`)
          )
        );
        const categoryResults = {};
        MOVIE_CATEGORIES.forEach((cat, i) => {
          categoryResults[cat] = responses[i].data.content || responses[i].data.results || [];
        });
        setCategoryData(categoryResults);
      } catch (err) {
        console.error("Error fetching category data:", err);
      }
    };
    fetchCategories();
  }, []);

  if (!trendingContent) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={COLORS.primary} size="large" />
        <Text style={{ color: COLORS.white, marginTop: 10 }}>
          Loading Trending...
        </Text>
      </View>
    );
  }

  const movie = Array.isArray(trendingContent)
    ? trendingContent[0]
    : trendingContent;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "black" }}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 🔥 Hero Banner */}
      <View style={{ height: screenHeight * 0.6 }}>
        <ImageBackground
          source={{
            uri: movie?.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : "https://via.placeholder.com/1280x720?text=No+Image",
          }}
          resizeMode="cover"
          style={{ flex: 1 }}
        >
          {/* Gradient Overlay */}
          <LinearGradient
            colors={[
              "rgba(0,0,0,0.9)",
              "rgba(0,0,0,0.3)",
              "transparent",
              "rgba(0,0,0,0.9)",
            ]}
            locations={[0, 0.3, 0.6, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Top Bar */}
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
              activeOpacity={0.7}
            >
              <Search size={26} color="white" />
            </TouchableOpacity>
          </View>

          {/* Movie Info */}
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              paddingHorizontal: 24,
              paddingBottom: 60,
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontSize: 26,
                fontWeight: "700",
                marginBottom: 6,
              }}
              numberOfLines={2}
            >
              {movie?.title || movie?.name}
            </Text>

            <Text
              style={{
                color: COLORS.white,
                fontSize: 14,
                marginBottom: 10,
              }}
            >
              {movie?.release_date?.slice(0, 4) ||
                movie?.first_air_date?.slice(0, 4)}{" "}
              | {movie?.adult ? "Adult" : "PG-13"}
            </Text>

            <Text
              style={{
                color: COLORS.white,
                fontSize: 13,
                opacity: 0.8,
                marginBottom: 14,
              }}
              numberOfLines={3}
            >
              {movie?.overview || "No description available."}
            </Text>

            {/* Buttons */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => router.push(`/watch/movie/${movie?.id}`)}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: COLORS.white,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                }}
              >
                <Play size={18} color="black" />
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    marginLeft: 6,
                  }}
                >
                  Play
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push(`/watch/movie/${movie?.id}`)}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                }}
              >
                <Info size={18} color="white" />
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginLeft: 6,
                  }}
                >
                  More Info
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Category Sliders */}
      {MOVIE_CATEGORIES.map((category) => {
        const items = categoryData[category] || [];
        const title =
          category.replaceAll("_", " ")[0].toUpperCase() +
          category.replaceAll("_", " ").slice(1);
        return (
          <View key={category} style={{ marginTop: 30 }}>
            <Text
              style={{
                color: COLORS.white,
                fontSize: 18,
                fontWeight: "600",
                marginLeft: 16,
                marginBottom: 12,
              }}
            >
              {title}
            </Text>

            <FlatList
              data={items.slice(0, 10)}
              horizontal
              keyExtractor={(item, i) => String(item?.id ?? i)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push(`/watch/movie/${item.id}`)}
                  style={{ marginRight: 12 }}
                >
                  <Image
                    source={{
                      uri: item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "https://via.placeholder.com/300x450?text=No+Image",
                    }}
                    style={{
                      width: 130,
                      height: 190,
                      borderRadius: 8,
                      backgroundColor: COLORS.surfaceLight,
                    }}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      color: COLORS.white,
                      fontSize: 12,
                      width: 130,
                      marginTop: 5,
                      textAlign: "center",
                    }}
                  >
                    {item.title || item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Movie;
