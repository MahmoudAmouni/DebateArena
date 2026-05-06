import { z } from 'zod';

export const batchSubmitSchema = z.object({
  body: z.object({
    answers: z.array(z.object({
      roundNumber: z.number().int().min(1).max(5),
      content: z.string().min(1)
    })).length(5)
  })
});
