import winston from 'winston';
import { env } from './env';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const isDevelopment = env.NODE_ENV === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  env.NODE_ENV === 'development' 
    ? winston.format.colorize({ all: true }) 
    : winston.format.json(),
  winston.format.printf(
    (info) => env.NODE_ENV === 'development' 
      ? `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
      : JSON.stringify(info)
  ),
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: winston.format.json()
  }),
  new winston.transports.File({ 
    filename: 'logs/combined.log',
    format: winston.format.json()
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;
