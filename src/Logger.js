const winston = require('winston');
const correlation = require('express-correlation-id');
const dotenv = require('dotenv');
dotenv.config();
require('winston-mongodb');

class LoggerUtils {
  static instance;

  getLogger() {
    return winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format((info) => {
              info.correlationId = correlation.getId() || '';
              return info;
            })(),
            winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            winston.format.splat(),
            winston.format.printf(this.logTransform),
          )
        }),
        new winston.transports.MongoDB({
          level: 'error',
          db: process.env.MONGO_URL,
          collection: 'logs',
          options: {
            useUnifiedTopology: true,
            // auth: {
            //   username: 'admin',
            //   password: 'password'
            // }
          },
          format: winston.format.combine(
            winston.format((info) => {
              info.correlationId = correlation.getId() || '';
              return info;
            })(),
            winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            winston.format.splat(),
            winston.format.metadata({
              fillWith: ['correlationId']
            }),
            winston.format.json(),
          )
        })
      ],
      exitOnError: false,
    });
  }

  static getInstance() {
    if (!LoggerUtils.instance) {
      const loggerUtils = new LoggerUtils();
      LoggerUtils.instance = loggerUtils.getLogger();
    }

    return LoggerUtils.instance;
  }

  logTransform = (info) => {
    const { level, message, timestamp, correlationId } = info;
    return `${timestamp} -${correlationId}- ${level}: ${message}`;
  };
}

const logger = LoggerUtils.getInstance();

module.exports = {
  logger,
  Logger: winston.Logger
}
