import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, status = 200, meta?: any) => {
  return res.status(status).json({
    success: true,
    data,
    ...(meta && { meta }),
  });
};

export const sendError = (res: Response, code: string, message: string, status = 500, fields?: any) => {
  return res.status(status).json({
    success: false,
    error: {
      code,
      message,
      ...(fields && { fields }),
    },
  });
};
