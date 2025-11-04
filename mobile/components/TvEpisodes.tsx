import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
} from "react-native";
import { getWatchProgress, saveWatchProgress } from "@/utils/watchProgress";

const TvEpisodes = ({ id, onSetData, seasons }: any) => {
  const [selectedSeason, setSelectedSeason] = useState<any>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const initializedRef = useRef(false);
  const episodeListRef = useRef<FlatList<number>>(null);

  // 🔥 Animation refs per episode index
  const scaleAnimations = useRef<Record<number, Animated.Value>>({}).current;

  // Load progress only once
  useEffect(() => {
    const init = async () => {
      if (initializedRef.current) return;
      if (!id || !seasons || seasons.length === 0) return;

      try {
        const saved = await getWatchProgress(String(id));

        if (saved) {
          const savedSeason = seasons.find(
            (s: any) => s.season_number === saved.season
          );
          if (savedSeason) {
            setSelectedSeason(savedSeason);
            setSelectedEpisode(saved.episode);
            onSetData?.({
              showSeason: saved.season,
              showEpisode: saved.episode,
            });
            initializedRef.current = true;
            return;
          }
        }

        const first = seasons.find((s: any) => s.episode_count > 0);
        if (first) {
          setSelectedSeason(first);
          setSelectedEpisode(1);
          onSetData?.({ showSeason: first.season_number, showEpisode: 1 });
          await saveWatchProgress(String(id), {
            season: first.season_number,
            episode: 1,
          });
        }

        initializedRef.current = true;
      } catch (err) {
        console.error("[TvEpisodes:init]", err);
      }
    };

    init();
  }, [id, seasons]);

  const handleSeasonSelect = async (season: any) => {
    if (selectedSeason?.id === season.id) return;
    setSelectedSeason(season);
    setSelectedEpisode(1);

    onSetData?.({
      showSeason: season.season_number,
      showEpisode: 1,
    });

    try {
      await saveWatchProgress(String(id), {
        season: season.season_number,
        episode: 1,
      });
    } catch (err) {
      console.error("[TvEpisodes] save error", err);
    }

    episodeListRef.current?.scrollToIndex({ index: 0, animated: true });
  };

  const handleEpisodeSelect = (episode: number) => {
    if (!selectedSeason || selectedEpisode === episode) return;

    // 🔥 Animate the clicked episode
    if (!scaleAnimations[episode]) {
      scaleAnimations[episode] = new Animated.Value(1);
    }

    Animated.sequence([
      Animated.timing(scaleAnimations[episode], {
        toValue: 1.1,
        duration: 120,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimations[episode], {
        toValue: 1,
        duration: 150,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // 1️⃣ Update UI instantly
    setSelectedEpisode(episode);

    const seasonNum = selectedSeason.season_number;

    // 2️⃣ Notify parent safely
    requestAnimationFrame(() => {
      onSetData?.({
        showSeason: seasonNum,
        showEpisode: episode,
      });
    });

    // 3️⃣ Save progress silently
    saveWatchProgress(String(id), { season: seasonNum, episode }).catch((err) =>
      console.error("[TvEpisodes] save error", err)
    );

    // 4️⃣ Auto-scroll selected episode into view
    try {
      const index = episode - 1;
      episodeListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    } catch (e) {
      console.warn("[TvEpisodes] scroll error", e);
    }
  };

  return (
    <View style={{ marginTop: 16, width: "100%", alignItems: "center" }}>
      {/* Season Selector */}
      <Text style={{ color: "white", fontWeight: "700", marginBottom: 8 }}>
        Select Season
      </Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={(seasons || []).filter((s: any) => s.episode_count > 0)}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => {
          const active = selectedSeason?.id === item.id;
          return (
            <TouchableOpacity
              onPress={() => handleSeasonSelect(item)}
              activeOpacity={0.8}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                marginRight: 8,
                borderRadius: 24,
                backgroundColor: active ? "#2563EB" : "#111827",
                transform: [{ scale: active ? 1.03 : 1 }],
                shadowColor: active ? "#2563EB" : "#000",
                shadowOpacity: 0.22,
                shadowRadius: 6,
                elevation: active ? 6 : 1,
              }}
            >
              <Text
                style={{
                  color: active ? "white" : "#D1D5DB",
                  fontWeight: "600",
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Episode Selector */}
      {selectedSeason && (
        <>
          <Text
            style={{
              color: "white",
              fontWeight: "700",
              marginTop: 12,
              marginBottom: 8,
            }}
          >
            Episodes
          </Text>

          <FlatList
            ref={episodeListRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={Array.from(
              { length: selectedSeason.episode_count },
              (_, i) => i + 1
            )}
            keyExtractor={(num) => String(num)}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            getItemLayout={(_, index) => ({
              length: 80,
              offset: 80 * index,
              index,
            })}
            renderItem={({ item }) => {
              const active = selectedEpisode === item;

              // Create or reuse animation value for this episode
              if (!scaleAnimations[item]) {
                scaleAnimations[item] = new Animated.Value(1);
              }

              return (
                <Animated.View
                  style={{
                    transform: [{ scale: scaleAnimations[item] }],
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleEpisodeSelect(item)}
                    activeOpacity={0.8}
                    style={{
                      marginBottom: 12,
                      marginTop: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      marginRight: 8,
                      borderRadius: 20,
                      backgroundColor: active ? "#2563EB" : "#111827",
                      shadowColor: active ? "#2563EB" : "#000",
                      shadowOpacity: 0.22,
                      shadowRadius: 6,
                      elevation: active ? 6 : 1,
                    }}
                  >
                    <Text
                      style={{
                        color: active ? "white" : "#D1D5DB",
                        fontWeight: "600",
                      }}
                    >
                      Ep {item}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            }}
          />
        </>
      )}
    </View>
  );
};

export default React.memo(TvEpisodes);
