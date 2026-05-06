import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    bio: z.string().max(300, 'Bio cannot exceed 300 characters').optional(),
    avatarUrl: z.string().url('Invalid URL format for avatar').optional(),
  }),
});
