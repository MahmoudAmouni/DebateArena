import { z } from 'zod';

export const createSessionSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(120),
    creatorStance: z.string().min(1),
    description: z.string().optional(),
    categoryId: z.string().uuid(),
    format: z.enum(['quick', 'standard', 'extended']),
    visibility: z.enum(['public', 'invite_only']),
    scheduledAt: z.string().datetime().optional(),
    isRanked: z.boolean().default(true).optional(),
  }),
});

export const joinSessionSchema = z.object({
  body: z.object({
    stance: z.string().min(1),
  }),
});
