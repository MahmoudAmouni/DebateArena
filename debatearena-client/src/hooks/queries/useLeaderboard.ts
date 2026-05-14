import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/apiClient';
import type { LeaderboardResponse } from '../../types';

export const useLeaderboard = (limit?: number) => {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: () => api.get<LeaderboardResponse>('/users/leaderboard', { params: { limit } }),
  });
};
