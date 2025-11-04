import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import { ArrowLeft, Pencil } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuthUserStore } from "@/store/authUser";
import Toast from "react-native-toast-message";
import { avatarMap } from "@/constants/avatarMap";
import { COLORS } from "@/constants/theme";
const avatarCategories = {
  Classic: [
    "classic1.png",
    "classic2.png",
    "classic3.png",
    "classic4.png",
    "classic5.png",
    "classic6.jpg",
    "classic7.jpg",
    "classic8.jpg",
    "classic9.jpg",
    "classic10.jpg",
    "classic11.jpg",
    "classic12.jpg",
  ],
  Insane: [
    "insane1.jpg",
    "insane2.jpg",
    "insane3.jpg",
    "insane4.jpg",
    "insane5.jpg",
    "insane6.jpg",
    "insane7.jpg",
    "insane8.jpg",
    "insane9.jpg",
    "insane10.jpg",
    "insane11.jpg",
    "insane12.jpg",
  ],
  Anime: [
    "anime1.jpg",
    "anime2.jpg",
    "anime3.jpg",
    "anime4.jpg",
    "anime5.jpg",
    "anime6.jpg",
    "anime7.jpg",
    "anime8.jpg",
    "anime9.jpg",
    "anime10.jpg",
    "anime11.jpg",
    "anime12.jpg",
  ],
  Funky: [
    "funky1.png",
    "funky2.jpg",
    "funky3.jpg",
    "funky4.jpg",
    "funky5.jpg",
    "funky6.png",
    "funky7.jpg",
    "funky8.jpg",
    "funky9.jpg",
    "funky10.jpg",
    "funky11.jpg",
    "funky12.jpg",
  ],
  Old: ["avatar1.png", "avatar2.png", "avatar3.png"],
};
const EditProfile = () => {
  const router = useRouter();
  const { user, updateInfo } = useAuthUserStore();
  const email = user?.email;
  const [username, setUsername] = useState(user.username);
  const [selected, setSelected] = useState(
    user.image || "/avatars/classic/classic-1.jpg"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (category: string, avatar: string) => {
    const path = `/avatars/${category.toLowerCase()}/${avatar}`;
    setSelected(path);
  };

  const handleSave = () => {
    updateInfo({ username, email, avatar: selected });
    Toast.show({ type: "success", text1: "Profile updated!" });
    router.back();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator color={COLORS.primary} size="large" />
        <Text className="text-white mt-3">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="white" size={28} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">Edit Profile</Text>
      </View>

      {/* Avatar Preview */}
      <View className="items-center mt-4">
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={avatarMap[selected]}
            className="w-28 h-28 rounded-full border-2 border-gray-600"
          />
        </TouchableOpacity>
        <View className="flex-row items-center mt-3">
          <TextInput
            className="text-white border-b pb-1 border-gray-600 w-48 text-center text-lg"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor="#666"
          />
          <TouchableOpacity className="ml-2">
            <Pencil size={16} color="gray" />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-400 mt-1">{user.email}</Text>
      </View>

      {/* Avatar Categories */}
      <View className="mt-8">
        {Object.entries(avatarCategories).map(([category, avatars]) => (
          <View key={category} className="mb-6 px-4">
            <Text className="text-white text-lg font-bold mb-3">
              {category}
            </Text>
            <FlatList
              data={avatars}
              horizontal
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const imgPath = `/avatars/${category
                  .toLowerCase()
                  .replace(/ /g, "-")}/${item}`;
                return (
                  <TouchableOpacity
                    onPress={() => handleSelect(category, item)}
                    className={`mr-3 rounded-full border-4 ${
                      selected === imgPath
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      source={avatarMap[imgPath]}
                      className="w-20 h-20 rounded-full"
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        ))}
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-blue-600 mx-28 mt-8 p-3 rounded-full active:scale-95"
      >
        <Text className="text-white text-center text-lg font-semibold">
          Save Changes
        </Text>
      </TouchableOpacity>

      {/* Fullscreen Avatar Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/90 justify-center items-center"
        >
          <Image
            source={avatarMap[selected]}
            className="w-72 h-72 rounded-full"
          />
        </TouchableOpacity>
      </Modal>

      <Toast />
    </ScrollView>
  );
};

export default EditProfile;
