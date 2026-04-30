import app from './app';
import { env } from './config/env';
import prisma from './config/database';
import logger from './config/logger';

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    app.listen(env.PORT, () => {
      logger.info(`🚀 Server is running at http://localhost:${env.PORT}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
