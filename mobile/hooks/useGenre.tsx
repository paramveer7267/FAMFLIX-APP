import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import { useAuthUserStore } from "../store/authUser"; // ✅ import missing
import api from "@/utils/axiosInstance";

interface UseGenreProps {
  genreId: string;
}

const useGenre = ({ genreId }: UseGenreProps) => {
  const { contentType } = useContentStore();
  const { user } = useAuthUserStore();

  const [genres, setGenres] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ✅ 1. Fetch all genre categories (names and ids)
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get(`/api/v1/${contentType}/genre`);
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, [contentType]);

  // ✅ 2. Fetch content based on selected genre
  const fetchGenreResults = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await api.get(
        `/api/v1/${contentType}/genre/${genreId}?page=${page}`
      );

      const newResults = res.data.content;
      setSearchResults((prev) => [...prev, ...newResults]);
      setPage((prev) => prev + 1);

      if (page >= res.data.totalPages) setHasMore(false);
    } catch (error) {
      console.error("Error loading genre results:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 3. Auto-fetch results when genreId or contentType changes
  useEffect(() => {
    setSearchResults([]);
    setPage(1);
    setHasMore(true);
    fetchGenreResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genreId, contentType]);

  return {
    genres,
    searchResults,
    loading,
    hasMore,
    fetchMore: fetchGenreResults,
  };
};

export default useGenre;
