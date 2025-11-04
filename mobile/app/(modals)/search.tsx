import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Search as SearchIcon, Play } from "lucide-react-native";
import { COLORS } from "@/constants/theme";
import api from "@/utils/axiosInstance";
import { router } from "expo-router";

const Search = () => {
  const [activeTab, setActiveTab] = useState<"movie" | "tv">("movie");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 🔍 Search API call
  const fetchResults = async (currentPage = 1) => {
    if (!searchQuery.trim() || loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await api.get(
        `/api/v1/search/${activeTab}/${searchQuery.trim()}?page=${currentPage}`
      );

      const newResults =
        res.data?.content ||
        res.data?.results ||
        (Array.isArray(res.data) ? res.data : []);

      setResults((prev) =>
        currentPage === 1 ? newResults : [...prev, ...newResults]
      );
      setPage(currentPage + 1);

      if (!res.data?.totalPages || currentPage >= res.data.totalPages) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("❌ Search error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
    setResults([]);
    fetchResults(1);
  };

  const renderItem = ({ item }: any) => {
    const imageUri = item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : "https://via.placeholder.com/300x450?text=No+Image";

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push(`/watch/${activeTab}/${item.id}`)}
        style={{
          flex: 1 / 3,
          margin: 4,
          backgroundColor: COLORS.surfaceLight,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{ width: "100%", height: 180 }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 6,
            left: 6,
            right: 6,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: COLORS.white,
              fontSize: 12,
              textAlign: "center",
            }}
          >
            {item.title || item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 0,
      }}
    >
      {/* Header */}
      <Text
        style={{
          color: COLORS.white,
          fontSize: 22,
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Search
      </Text>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        {["movie", "tv"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              setActiveTab(tab as "movie" | "tv");
              setResults([]);
            }}
            activeOpacity={0.8}
            style={{
              backgroundColor:
                activeTab === tab ? COLORS.primary : COLORS.surfaceLight,
              paddingVertical: 6,
              paddingHorizontal: 14,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 16,
          backgroundColor: COLORS.surfaceLight,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginBottom: 12,
        }}
      >
        <TextInput
          placeholder={`Search ${activeTab === "movie" ? "Movies" : "TV Shows"}...`}
          placeholderTextColor={COLORS.grey}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            flex: 1,
            color: COLORS.white,
            fontSize: 14,
          }}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <SearchIcon size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading && results.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color={COLORS.primary} size="large" />
          <Text style={{ color: COLORS.white, marginTop: 10 }}>
            Searching...
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={3}
          onEndReached={() => fetchResults(page)}
          onEndReachedThreshold={0.7}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingTop: 12,
            paddingBottom: 60,
          }}
          ListEmptyComponent={
            !loading && (
              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.grey,
                  marginTop: 40,
                  fontSize: 14,
                }}
              >
                Start typing to search for{" "}
                {activeTab === "movie" ? "movies" : "TV shows"} 🎬
              </Text>
            )
          }
          ListFooterComponent={
            loading && results.length > 0 ? (
              <ActivityIndicator
                color={COLORS.primary}
                size="small"
                style={{ marginVertical: 20 }}
              />
            ) : null
          }
        />
      )}
    </View>
  );
};

export default Search;
