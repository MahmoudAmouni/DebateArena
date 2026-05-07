import { z } from 'zod';

export const createChallengeSchema = z.object({
  body: z.object({
    challengedId: z.string().uuid('Invalid user ID'),
    topic: z.string().min(5, 'Topic must be at least 5 characters').max(120, 'Topic is too long'),
    challengerStance: z.string().min(1, 'Stance is required'),
    categoryId: z.string().uuid('Invalid category ID'),
    message: z.string().max(300, 'Message is too long').optional(),
  })
});

export const respondChallengeSchema = z.object({
  body: z.object({
    accept: z.boolean(),
    stance: z.string().min(1, 'Stance is required').optional(), 
  })
});
