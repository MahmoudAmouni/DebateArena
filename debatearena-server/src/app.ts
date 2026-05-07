import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';

import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import sessionsRoutes from './modules/sessions/sessions.routes';
import debatesRoutes from './modules/debates/debates.routes';
import aiRoutes from './modules/ai/ai.routes';
import verdictsRoutes from './modules/verdicts/verdicts.routes';
import challengesRoutes from './modules/challenges/challenges.routes';
import moderationRoutes from './modules/moderation/moderation.routes';

const app: Application = express();

app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/debates', debatesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/verdicts', verdictsRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/moderation', moderationRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.originalUrl} not found`,
    },
  });
});

app.use(errorHandler);

export default app;
