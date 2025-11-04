import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LogOut, Pencil, Heart, InfoIcon } from "lucide-react-native";
import api from "@/utils/axiosInstance";
import Toast from "react-native-toast-message";
import { useAuthUserStore } from "@/store/authUser";
import { avatarMap } from "@/constants/avatarMap";

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
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
};

const Profile = () => {
  const router = useRouter();
  const { user, logout } = useAuthUserStore();
  const [watchHistory, setWatchHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/api/v1/watchHistory/history");
        if (res.data.success) setWatchHistory(res.data.content);
      } catch (err) {
        console.error("Failed to load watch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-2">Loading Profile...</Text>
      </View>
    );
  }
  if (!user) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator color="white" />
      </View>
    );
  }
  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex justify-center items-center mx-4 mt-4 mb-6">
        <Text className="text-white text-2xl font-bold">Profile</Text>
      </View>

      {/* Profile Info */}
      <View className="mx-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 space-x-4 flex-shrink">
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={
                user?.image
                  ? avatarMap[user?.image]
                  : require("@/assets/images/avatars/old/avatar1.png")
              }
              className="w-20 h-20 rounded-full"
            />
          </TouchableOpacity>

          <View className="flex-shrink">
            <Text className="text-white text-xl font-bold">
              {user?.username}
            </Text>
            <Text className="text-gray-400 text-sm">{user?.email}</Text>
            <Text className="text-blue-400 text-sm mt-1">
              Plan: Basic • Member since {formatDate(user?.createdAt)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-[#1F2937] px-4 py-2 rounded-lg flex-row items-center active:opacity-80"
          onPress={() => router.push("/(modals)/edit-profile")}
        >
          <Pencil size={18} color="white" />
          <Text className="text-white font-semibold">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Links */}
      <View className="flex-row flex-wrap justify-between mx-4 mt-8">
        <ProfileCard
          key="watchlist-card"
          icon={<Heart color="white" size={22} />}
          label="Watchlist"
          onPress={() => router.push("/(tabs)/watchlist")}
        />
        <ProfileCard
          key="about-card"
          icon={<InfoIcon color="white" size={22} />}
          label="Updates"
          onPress={() => router.push("/(modals)/updates")}
        />
        <ProfileCard
          key="logout-card"
          icon={<LogOut color="white" size={22} />}
          label="Logout"
          onPress={() => {
            logout();
            Toast.show({ type: "success", text1: "Logged out!" });
          }}
        />
      </View>

      {/* Recent Activity */}
      <View className="bg-[#1F2937] rounded-xl p-4 mx-4 mt-8">
        <Text className="text-white text-lg font-bold mb-4">
          Recent Activity
        </Text>

        {watchHistory.length > 0 ? (
          // Added "keyExtractor" and "nestedScrollEnabled"
          <FlatList
            data={watchHistory}
            keyExtractor={(item, index) =>
              item._id?.toString() || index.toString()
            }
            scrollEnabled={false}
            nestedScrollEnabled
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item._id}
                activeOpacity={0.8}
                onPress={() =>
                  router.push(
                    `/watch/${item.type}/${item.id}` as `/watch/[category]/[id]`
                  )
                }
                className="flex-row items-center justify-between bg-[#323f52] p-3 mb-2 rounded-lg"
              >
                <View className="flex-row items-center space-x-3 flex-1">
                  <Image
                    source={{ uri: IMG_BASE_URL + item?.image }}
                    className="w-12 h-16 rounded-lg"
                  />
                  <View className="flex-1">
                    <Text className="text-white text-sm font-semibold">
                      {item?.title}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      {formatDate(item?.created)}
                    </Text>
                  </View>
                </View>

                <Text
                  className={`px-3 py-1 rounded-full text-xs text-white ${
                    item?.type === "movie"
                      ? "bg-blue-600"
                      : item?.type === "tv"
                        ? "bg-green-600"
                        : "bg-red-600"
                  }`}
                >
                  {item?.type?.charAt(0).toUpperCase() + item?.type?.slice(1)}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text className="text-gray-400 text-center py-8">
            No recent activity yet.
          </Text>
        )}
      </View>

      {/* Avatar Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/80 justify-center items-center"
        >
          <Image
            source={avatarMap[user.image]}
            className="w-64 h-64 rounded-full"
          />
        </TouchableOpacity>
      </Modal>

      <Toast />
    </ScrollView>
  );
};

const ProfileCard = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-[#1F2937] w-[48%] p-5 rounded-xl items-center justify-center mb-4 active:scale-95"
  >
    <View className="mb-2">{icon}</View>
    <Text className="text-white text-sm font-semibold">{label}</Text>
  </TouchableOpacity>
);

export default Profile;
