import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { COLORS } from "@/constants/theme";
import { router } from "expo-router";
import api from "@/utils/axiosInstance";

const { width } = Dimensions.get("window");
const POSTER_WIDTH = width / 3 - 16;

const Browse = () => {
  const [movie, setMovie] = useState(null); // single object
  const [tvShow, setTvShow] = useState(null); // single object
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, tvRes] = await Promise.all([
          api.get("/api/v1/movie/trending"),
          api.get("/api/v1/tv/trending"),
        ]);

        setMovie(
          movieRes.data?.content ||
            movieRes.data?.result ||
            movieRes.data ||
            null
        );

        setTvShow(
          tvRes.data?.content || tvRes.data?.result || tvRes.data || null
        );
      } catch (err) {
        console.error("❌ Error loading browse content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
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
        <Text style={{ color: COLORS.white, marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  const renderPoster = (item, type) => (
    <TouchableOpacity
      key={item.id}
      activeOpacity={0.85}
      onPress={() => router.push(`/watch/${type}/${item.id}`)}
      style={{ marginRight: 10, alignItems: "center" }}
    >
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image",
        }}
        style={{
          width: POSTER_WIDTH,
          height: POSTER_WIDTH * 1.5,
          borderRadius: 10,
          backgroundColor: COLORS.surfaceLight,
        }}
      />
      <Text
        numberOfLines={1}
        style={{
          color: COLORS.white,
          fontSize: 12,
          width: POSTER_WIDTH,
          marginTop: 5,
          textAlign: "center",
        }}
      >
        {item.title || item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          color: COLORS.white,
          fontSize: 22,
          fontWeight: "700",
          textAlign: "center",
        }}
        className="mt-4 mb-6"
      >
        Browse
      </Text>

      {/* Trending Movie Section */}
      {movie && (
        <View style={{ marginBottom: 30 }}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 18,
              fontWeight: "600",
              marginLeft: 14,
              marginBottom: 12,
            }}
          >
            Trending Movie
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {renderPoster(movie, "movie")}
          </View>
        </View>
      )}

      {/* Trending TV Show Section */}
      {tvShow && (
        <View style={{ marginBottom: 30 }}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 18,
              fontWeight: "600",
              marginLeft: 14,
              marginBottom: 12,
            }}
          >
            Trending TV Show
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {renderPoster(tvShow, "tv")}
          </View>
        </View>
      )}

      {/* Category Sections */}
      <CategorySection
        type="movie"
        title="Top Rated Movies"
        endpoint="top_rated"
      />
      <CategorySection type="movie" title="Popular Movies" endpoint="popular" />
      <CategorySection type="tv" title="Top Rated TV" endpoint="top_rated" />
      <CategorySection type="tv" title="Airing Today" endpoint="airing_today" />
    </ScrollView>
  );
};

// ✅ Reusable Category Section
const CategorySection = ({ type, title, endpoint }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/api/v1/${type}/${endpoint}`);
        const parsed =
          res.data?.content?.results ||
          res.data?.content ||
          res.data?.results ||
          (Array.isArray(res.data) ? res.data : []);
        setData(parsed);
      } catch (err) {
        console.error(`❌ Error fetching ${title}:`, err);
      }
    };
    fetchCategory();
  }, []);

  if (!data.length) return null;

  return (
    <View style={{ marginBottom: 30 }}>
      <Text
        style={{
          color: COLORS.white,
          fontSize: 18,
          fontWeight: "600",
          marginLeft: 14,
          marginBottom: 12,
        }}
      >
        {title}
      </Text>

      <FlatList
        data={data.slice(0, 10)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => String(item?.id ?? i)}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push(`/watch/${type}/${item.id}`)}
            style={{ marginRight: 10 }}
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
};

export default Browse;
