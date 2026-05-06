import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { UnprocessableEntityError } from '../utils/errors';

export const validate = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        (error.issues || []).forEach((err) => {
          const path = err.path.length > 1 ? err.path.slice(1).join('.') : err.path.join('.');
          fields[path] = err.message;
        });

        return next(new UnprocessableEntityError('Validation failed', 'VALIDATION_ERROR', fields));
      }
      return next(error);
    }
  };
};
