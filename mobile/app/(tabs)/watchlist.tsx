import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Trash, ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import useWatchlist from "@/hooks/useWatchlist";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { COLORS } from "@/constants/theme";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/original";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const WatchList = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: watchlist = [], isLoading, isError, refetch } = useWatchlist();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (entry: any) =>
      axios.delete(`/api/v1/watchlist/movie/${entry.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      Toast.show({ type: "success", text1: "Deleted from Watchlist!" });
    },
    onError: () =>
      Toast.show({ type: "error", text1: "Failed to delete item." }),
  });

  // Clear all mutation
  const clearMutation = useMutation({
    mutationFn: async () => axios.delete("/api/v1/watchlist/movies/clear"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });

      Toast.show({ type: "success", text1: "Watchlist cleared!" });
    },
    onError: () =>
      Toast.show({ type: "error", text1: "Failed to clear watchlist." }),
  });

  // Confirm delete single item
  const confirmDelete = (item: any) => {
    Alert.alert(
      "Delete from Watchlist",
      `Are you sure you want to remove "${item.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMutation.mutate(item),
        },
      ]
    );
  };

  // Confirm clear all
  const confirmClearAll = () => {
    Alert.alert(
      "Clear Watchlist",
      "Are you sure you want to clear all items from your Watchlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => clearMutation.mutate(),
        },
      ]
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator color={COLORS.primary} size="large" />{" "}
        <Text className="text-white mt-3">Loading Watchlist...</Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-red-500 text-lg font-bold">
          Failed to load Watchlist 😞
        </Text>
        <TouchableOpacity
          className="bg-blue-600 px-5 py-2 rounded-lg mt-4"
          onPress={() => refetch()}
        >
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state
  if (watchlist.length === 0) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-14 left-5"
        >
          <ArrowLeft color="white" size={28} />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Watchlist</Text>
        <Text className="text-gray-400 mt-2">No items found 😥</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row justify-between items-center mx-4 mt-4 mb-8">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="white" size={28} />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Watchlist</Text>
        <TouchableOpacity onPress={confirmClearAll}>
          <Text className="text-red-600 font-semibold text-lg">Clear all</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={watchlist}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(
                `/watch/${item.type}/${item.id}` as `/watch/[category]/[id]`
              )
            }
            className="flex-row bg-[#1F2937] rounded-xl p-3 mx-4 mb-3 items-center active:opacity-80"
          >
            <Image
              source={{ uri: IMG_BASE_URL + item.image }}
              className="w-[70px] h-[100px] rounded-lg mr-3"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-white text-base font-semibold">
                {item.title || item.name}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                {formatDate(item.created)}
              </Text>
              <Text
                className={`text-white px-3 py-1 mt-2 rounded-full text-xs self-start ${
                  item.type === "movie"
                    ? "bg-blue-600"
                    : item.type === "tv"
                      ? "bg-green-600"
                      : "bg-red-600"
                }`}
              >
                {item.type[0].toUpperCase() + item.type.slice(1)}
              </Text>
            </View>

            <TouchableOpacity onPress={() => confirmDelete(item)}>
              <Trash color="white" size={22} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <Toast />
    </View>
  );
};

export default WatchList;
