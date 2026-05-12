import { Request, Response, NextFunction } from 'express';
import { moderationService } from './moderation.service';
import { sendSuccess } from '../../utils/apiResponse';
import { ReportStatus } from '@prisma/client';

export const submitReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reporterId = req.user!.id as string;
    const report = await moderationService.submitReport(reporterId, req.body);
    sendSuccess(res, report, 201);
  } catch (error) {
    next(error);
  }
};

export const reviewReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.id as string;
    const reportId = req.params.id as string;
    const { action } = req.body;
    const result = await moderationService.reviewReport(adminId, reportId, action);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as ReportStatus | undefined;
    const reports = await moderationService.getReports(status);
    sendSuccess(res, reports);
  } catch (error) {
    next(error);
  }
};

export const warnUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id as string;
    const user = await moderationService.warnUser(userId);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

export const suspendUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id as string;
    const { hours } = req.body;
    const user = await moderationService.suspendUser(userId, hours);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

export const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id as string;
    const user = await moderationService.banUser(userId);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};
