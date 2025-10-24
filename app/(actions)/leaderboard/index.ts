// hooks handler for all things concerning leaderboard
import {
  LeaderboardEntry,
  TimeRangeOption,
} from "@/app/dashboard/leaderboard/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch leaderboard entries for a given time range and expose react-query state for the request.
 *
 * @param timeRange - The time range to filter leaderboard results.
 * @returns An object with:
 *  - `leaderboardData`: the fetched `LeaderboardEntry[]` or `undefined` if not available,
 *  - `isLoadingLeaderboardData`: `true` while the query is loading,
 *  - `errorLeaderboardData`: the error returned by the query, if any,
 *  - `isErrorLeaderboardData`: `true` if the query settled with an error,
 *  - `isSuccessLeaderboardData`: `true` if the query successfully fetched data.
 */
function useGetLeaderboardData(timeRange: TimeRangeOption) {
  const {
    data: leaderboardData,
    isLoading: isLoadingLeaderboardData,
    error: errorLeaderboardData,
    isError: isErrorLeaderboardData,
    isSuccess: isSuccessLeaderboardData,
  } = useQuery({
    queryKey: ["leaderboardData", timeRange],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const response = await fetch(`/api/leaderboard?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      return await response.json();
    },
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return {
    leaderboardData,
    isLoadingLeaderboardData,
    errorLeaderboardData,
    isErrorLeaderboardData,
    isSuccessLeaderboardData,
  };
}

export default useGetLeaderboardData;