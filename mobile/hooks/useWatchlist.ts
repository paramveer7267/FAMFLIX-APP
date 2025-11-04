import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axiosInstance";

const useWatchlist = () => {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const res = await api.get(`/api/v1/watchlist/movies`);
      return res.data.content;
    },
    retry: 2, // retry twice if it fails
  });
};

export default useWatchlist;
