// mobile/utils/watchProgress.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "WATCH_PROGRESS_V1";

export type Progress = { season: number; episode: number };

export const saveWatchProgress = async (id: string, data: Progress) => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[id] = data;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (err) {
    console.error("[saveWatchProgress] error", err);
  }
};

export const getWatchProgress = async (
  id: string
): Promise<Progress | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed[id] ?? null;
  } catch (err) {
    console.error("[getWatchProgress] error", err);
    return null;
  }
};

export const clearAllProgress = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log("[clearAllProgress] removed storage");
  } catch (err) {
    console.error("[clearAllProgress] error", err);
  }
};
