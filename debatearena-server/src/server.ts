import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { env } from './config/env';
import prisma from './config/database';
import logger from './config/logger';
import { setupSocketHandlers } from './socket/index';
import { verdictWorker } from './workers/verdictWorker';
import { debatePhaseWorker } from './workers/debatePhaseWorker';
import { eloWorker } from './workers/eloWorker';
import { expiryWorker } from './workers/expiryWorker';
import { badgeWorker } from './workers/badgeWorker';

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    credentials: true,
  },
});

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    setupSocketHandlers(io);

    server.listen(env.PORT, () => {
      logger.info(`🚀 Server is running at http://localhost:${env.PORT}`);
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      
      server.close(async () => {
        logger.info('HTTP server closed.');
        
        try {
          await Promise.all([
            verdictWorker.close(),
            debatePhaseWorker.close(),
            eloWorker.close(),
            expiryWorker.close(),
            badgeWorker.close()
          ]);
          logger.info('✅ All workers closed');

          await prisma.$disconnect();
          logger.info('✅ Database disconnected');
          
          process.exit(0);
        } catch (err) {
          logger.error('Error during shutdown:', err);
          process.exit(1);
        }
      });

      // Force close after 10s
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
