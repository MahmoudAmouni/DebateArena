import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/apiClient';
import type { DebateHistoryItem } from '../../types';

export const useUserDebates = () => {
  return useQuery({
    queryKey: ['user-debates'],
    queryFn: () => api.get<DebateHistoryItem[]>('/users/me/debates'),
  });
};
