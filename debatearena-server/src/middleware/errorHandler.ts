import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';
import logger from '../config/logger';
import { AppError } from '../utils/errors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const isAppError = err instanceof AppError;
  
  const status = isAppError ? err.status : (err.status || 500);
  const code = isAppError ? err.code : (err.code || 'INTERNAL_SERVER_ERROR');
  const message = err.message || 'An unexpected error occurred';
  const fields = isAppError ? err.fields : err.fields;

  if (status >= 500) {
    logger.error(`${req.method} ${req.path} - ${message}`, { stack: err.stack });
  } else {
    logger.warn(`${req.method} ${req.path} - ${status} ${code} - ${message}`);
  }

  return sendError(res, code, message, status, fields);
};
