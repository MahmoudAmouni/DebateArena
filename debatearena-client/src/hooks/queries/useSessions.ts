import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/apiClient';
import type { SessionFeedResponse } from '../../types';

export const useSessions = (status?: string) => {
  return useQuery({
    queryKey: ['sessions', status],
    queryFn: () => api.get<SessionFeedResponse>('/sessions', { 
      params: { status: status === 'live' ? 'active' : status } 
    }),
  });
};
