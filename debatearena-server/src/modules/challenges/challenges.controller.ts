import { Request, Response, NextFunction } from 'express';
import { challengesService } from './challenges.service';
import { sendSuccess } from '../../utils/apiResponse';

export const sendChallenge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const challengerId = req.user!.id as string;
    const challenge = await challengesService.sendChallenge(challengerId, req.body);
    sendSuccess(res, challenge, 201);
  } catch (error) {
    next(error);
  }
};

export const getReceivedChallenges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id as string;
    const challenges = await challengesService.getReceivedChallenges(userId);
    sendSuccess(res, challenges);
  } catch (error) {
    next(error);
  }
};

export const getSentChallenges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id as string;
    const challenges = await challengesService.getSentChallenges(userId);
    sendSuccess(res, challenges);
  } catch (error) {
    next(error);
  }
};

export const acceptChallenge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id as string;
    const challengeId = req.params.id as string;
    const { stance } = req.body;
    const session = await challengesService.acceptChallenge(userId, challengeId, stance);
    sendSuccess(res, session);
  } catch (error) {
    next(error);
  }
};

export const declineChallenge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id as string;
    const challengeId = req.params.id as string;
    const challenge = await challengesService.declineChallenge(userId, challengeId);
    sendSuccess(res, challenge);
  } catch (error) {
    next(error);
  }
};
