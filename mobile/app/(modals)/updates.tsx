import React from "react";
import { View, Text, ScrollView } from "react-native";
import { updates } from "@/constants/updates";
import Footer from "@/components/Footer";

const Updates = () => {
  return (
    <View className="flex-1 bg-black justify-between">
      <ScrollView
        className="flex-grow px-4 py-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-white text-3xl font-bold">Updates</Text>
          <Text className="text-gray-400 mt-2 text-sm">
            Discover what's new in every version of FAMFLIX.
          </Text>
        </View>

        {/* Updates List */}
        {updates.map((item, index) => (
          <View
            key={index}
            className="mb-6 border border-gray-800 rounded-2xl bg-[#111] p-4"
          >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-1 pr-2">
                <Text className="text-white font-semibold text-lg">
                  {item.title}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  v{item.version} •{" "}
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>

              <View
                className={`px-3 py-1 rounded-full ${
                  item.active ? "bg-green-700/30" : "bg-gray-800/60"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    item.active ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {item.active ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text className="text-gray-300 text-sm mb-3">
              {item.description}
            </Text>

            {/* Updates Section */}
            {item.updates?.trim() && (
              <View className="mb-3">
                <Text className="text-white font-semibold mb-1">
                  🚀 Updates
                </Text>
                {item.updates
                  .trim()
                  .split("•")
                  .filter((u) => u.trim())
                  .map((u, i) => (
                    <Text key={i} className="text-gray-400 text-sm ml-2">
                      • {u.trim()}
                    </Text>
                  ))}
              </View>
            )}

            {/* Bug Fixes Section */}
            {item.bugFixes?.trim() && (
              <View>
                <Text className="text-white font-semibold mb-1">
                  🐞 Bug Fixes
                </Text>
                {item.bugFixes
                  .trim()
                  .split("•")
                  .filter((b) => b.trim())
                  .map((b, i) => (
                    <Text key={i} className="text-gray-400 text-sm ml-2">
                      • {b.trim()}
                    </Text>
                  ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* ✅ Footer always at bottom */}
      <Footer />
    </View>
  );
};

export default Updates;
