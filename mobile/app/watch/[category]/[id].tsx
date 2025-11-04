import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import {
  BookmarkPlus,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import Toast from "react-native-toast-message";
import api from "@/utils/axiosInstance";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import useWatchlist from "@/hooks/useWatchlist";
import TvEpisodes from "@/components/TvEpisodes";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
const { width } = Dimensions.get("window");

const WatchPage = () => {
  const { category, id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const sliderRef = useRef<FlatList>(null);

  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trailers, setTrailers] = useState<any[]>([]);
  const [tab, setTab] = useState("stream");
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [similar, setSimilar] = useState<any[]>([]);
  const [cast, setCast] = useState<any[]>([]);

  // Added for TV show episodes
  const [seasonNumber, setSeasonNumber] = useState<number | null>(null);
  const [episodeNumber, setEpisodeNumber] = useState<number | null>(null);
  const [showEpisodes, setShowEpisodes] = useState(true);

  const { data: watchlist = [] } = useWatchlist();

  const addToWatchlistMutation = useMutation({
    mutationFn: async () => api.post(`/api/v1/watchlist/${category}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      setIsBookmarked(true);
      Toast.show({ type: "success", text1: "Added to Watchlist!" });
    },
    onError: (error: any) => {
      if (error.response?.status === 409) {
        Toast.show({ type: "error", text1: "Already in Watchlist!" });
      } else {
        Toast.show({ type: "error", text1: "Failed to add to Watchlist!" });
      }
    },
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async () => api.delete(`/api/v1/watchlist/movie/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      setIsBookmarked(false);
      Toast.show({ type: "success", text1: "Removed from Watchlist!" });
    },
    onError: () => Toast.show({ type: "error", text1: "Failed to remove." }),
  });

  const handleBookmarkToggle = () => {
    if (isBookmarked) removeFromWatchlistMutation.mutate();
    else addToWatchlistMutation.mutate();
  };

  // ✅ Load content details
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [detailsRes, trailersRes, similarRes, castRes] =
          await Promise.all([
            api.get(`/api/v1/${category}/${id}/details`),
            api.get(`/api/v1/${category}/${id}/trailers`),
            api.get(`/api/v1/${category}/${id}/similar`),
            api.get(`/api/v1/${category}/credits/${id}`),
          ]);

        setContent(
          detailsRes.data.details || detailsRes.data.content || detailsRes.data
        );
        setTrailers(trailersRes.data.trailers || []);
        setSimilar(similarRes.data.content || []);
        setCast(castRes.data.casts || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, id]);

  // ✅ Check bookmark status
  useEffect(() => {
    const bookmarked = watchlist?.some(
      (item) => String(item.id) === id && item.type === category
    );
    setIsBookmarked(bookmarked);
  }, [watchlist, id, category]);

  const handlePrevTrailer = () => {
    if (currentTrailerIdx > 0) setCurrentTrailerIdx(currentTrailerIdx - 1);
  };

  const handleNextTrailer = () => {
    if (currentTrailerIdx < trailers.length - 1)
      setCurrentTrailerIdx(currentTrailerIdx + 1);
  };

  // 🆕 handle episode select from TvEpisodes
  const handleSetEpisodeData = (data: {
    showSeason: number;
    showEpisode: number;
  }) => {
    setSeasonNumber(data.showSeason);
    setEpisodeNumber(data.showEpisode);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-4">Loading...</Text>
      </View>
    );
  }

  if (!content) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg">Content not found 😥</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="white" size={28} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold flex-1 text-center">
          {content.title || content.name}
        </Text>
        <TouchableOpacity onPress={handleBookmarkToggle}>
          {isBookmarked ? (
            <BookmarkCheck color="#60A5FA" size={28} />
          ) : (
            <BookmarkPlus color="white" size={28} />
          )}
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-center gap-2 mb-4">
        {["stream", "trailer"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            className={`px-4 py-2 rounded ${
              tab === t ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            <Text className="text-white font-semibold capitalize">{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Player */}
      <View className="mx-4 mb-4 rounded-xl overflow-hidden">
        {tab === "trailer" ? (
          trailers.length > 0 ? (
            <>
              <View className="flex-row justify-between items-center px-6 mb-2">
                <TouchableOpacity
                  onPress={handlePrevTrailer}
                  disabled={currentTrailerIdx === 0}
                  className={`p-2 rounded-full ${
                    currentTrailerIdx === 0 ? "opacity-30" : "opacity-100"
                  }`}
                >
                  <ChevronLeft color="white" size={26} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNextTrailer}
                  disabled={currentTrailerIdx === trailers.length - 1}
                  className={`p-2 rounded-full ${
                    currentTrailerIdx === trailers.length - 1
                      ? "opacity-30"
                      : "opacity-100"
                  }`}
                >
                  <ChevronRight color="white" size={26} />
                </TouchableOpacity>
              </View>
              <WebView
                source={{
                  uri: `https://www.youtube.com/embed/${trailers[currentTrailerIdx]?.key}`,
                }}
                style={{ height: 250 }}
                allowsFullscreenVideo
              />
            </>
          ) : (
            <Text className="text-gray-400 text-center mt-4">
              No trailers available.
            </Text>
          )
        ) : (
          <WebView
            source={{
              uri:
                category === "tv" && seasonNumber && episodeNumber
                  ? `https://vidsrc.ru/tv/${id}/${seasonNumber}/${episodeNumber}`
                  : `https://vidsrc.ru/${category}/${id}`,
            }}
            style={{ height: 250 }}
            allowsFullscreenVideo
          />
        )}
      </View>

      {/* Show TV Episode Selector */}
      {category === "tv" && (
        <View className="items-center my-4">
          <TouchableOpacity
            className={`px-6 py-2 rounded ${
              showEpisodes ? "bg-blue-600" : "bg-gray-700"
            }`}
            onPress={() => setShowEpisodes(!showEpisodes)}
          >
            <Text className="text-white font-semibold">
              {showEpisodes ? "Hide Episodes" : "Show Episodes"}
            </Text>
          </TouchableOpacity>

          {showEpisodes && (
            <TvEpisodes
              id={content.id}
              onSetData={handleSetEpisodeData}
              seasons={content.seasons}
            />
          )}
        </View>
      )}

      {/* Overview */}
      <View className="px-4">
        <Text className="text-white text-lg font-semibold mb-2">Overview</Text>
        <Text className="text-gray-300 leading-5">{content.overview}</Text>
      </View>

      {/* Genres */}
      {content.genres && (
        <View className="px-4 mt-4">
          <Text className="text-blue-400 text-lg font-bold mb-2">Genres</Text>
          <Text className="text-gray-300">
            {content.genres.map((g: any) => g.name).join(", ")}
          </Text>
        </View>
      )}

      {/* Cast */}
      {cast.length > 0 && (
        <View className="px-4 mt-6">
          <Text className="text-blue-400 text-lg font-bold mb-3">Top Cast</Text>
          <FlatList
            horizontal
            data={cast.slice(0, 10)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="items-center mr-4">
                <Image
                  source={{
                    uri: item.profile_path
                      ? `${IMG_BASE_URL}${item.profile_path}`
                      : "https://via.placeholder.com/100x150.png?text=No+Image",
                  }}
                  className="w-20 h-28 rounded-lg mb-1"
                  resizeMode="cover"
                />
                <Text className="text-gray-200 text-xs text-center w-20">
                  {item.name}
                </Text>
              </View>
            )}
          />
        </View>
      )}

      {/* Similar Content */}
      {similar.length > 0 && (
        <View className="px-4 mt-8">
          <Text className="text-blue-400 text-lg font-bold mb-3">
            Similar {category === "movie" ? "Movies" : "Shows"}
          </Text>
          <FlatList
            horizontal
            ref={sliderRef}
            data={similar}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/watch/[category]/[id]",
                    params: { category, id: String(item.id) },
                  })
                }
                className="mr-4"
              >
                <Image
                  source={{ uri: IMG_BASE_URL + item.poster_path }}
                  className="w-32 h-48 rounded-lg"
                />
                <Text
                  numberOfLines={1}
                  className="text-gray-300 text-xs w-32 mt-1 text-center"
                >
                  {item.title || item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Poster */}
      <View className="px-4 mt-8">
        <Text className="text-blue-400 text-lg font-bold mb-2">Poster</Text>
        <Image
          source={{ uri: IMG_BASE_URL + content.poster_path }}
          className="w-full h-80 rounded-xl"
          resizeMode="contain"
        />
      </View>

      <Toast />
    </ScrollView>
  );
};

export default WatchPage;
