import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import useGenre from "@/hooks/useGenre";
import { useContentStore } from "@/store/content";
import axios from "axios";
const TMDB_MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const TMDB_TV_GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

const Genre = () => {
  const { contentType } = useContentStore();
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [genreResults, setGenreResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGenreContent = async (genreId: number) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/v1/${contentType}/genre/${genreId}?page=1`
      );
      setGenreResults(res.data.content || []);
    } catch (err) {
      console.error("Failed to fetch genre content", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGenre = (genreId: number) => {
    setSelectedGenre(genreId);
    fetchGenreContent(genreId);
  };

  const renderGenreTabs = () => (
    <FlatList
      data={TMDB_MOVIE_GENRES}
      horizontal
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handleSelectGenre(item.id)}
          style={{
            backgroundColor: selectedGenre === item.id ? "#6366f1" : "#374151",
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 10,
            marginRight: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <FlatList
      data={genreResults}
      keyExtractor={(item, index) => item._id?.toString() || index.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 16 }}>
          <Text style={{ color: "white", fontSize: 16 }}>
            {item.title || item.name}
          </Text>
        </View>
      )}
      ListHeaderComponent={renderGenreTabs}
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator color="white" style={{ marginTop: 20 }} />
        ) : selectedGenre ? (
          <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
            No results found.
          </Text>
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
};

export default Genre;
