import dotenv from 'dotenv';
import { SERVER_PORT, STORAGE_NAME } from './constants.js';

dotenv.config();

const env = process.env.NODE_ENV;

const memory = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || SERVER_PORT.APP_PORT,
  },

  queueStorage: {
    name: process.env.QUEUE_STORAGE,
    host: process.env.QUEUE_HOST,
    port: SERVER_PORT.REDIS_PORT,
  },

  storage: {
    name: STORAGE_NAME.MEMORY,
    host: process.env.STORAGE_HOST,
    port: SERVER_PORT.REDIS_PORT,
  },
};

const redis = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || SERVER_PORT.APP_PORT,
  },

  queueStorage: {
    name: process.env.QUEUE_STORAGE,
    host: process.env.QUEUE_HOST,
    port: SERVER_PORT.REDIS_PORT,
  },

  storage: {
    name: STORAGE_NAME.REDIS,
    host: process.env.STORAGE_HOST,
    port: SERVER_PORT.REDIS_PORT,
  },
};

const sql = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || SERVER_PORT.APP_PORT,
  },

  queueStorage: {
    name: process.env.QUEUE_STORAGE,
    host: process.env.QUEUE_HOST,
    port: SERVER_PORT.REDIS_PORT,
  },

  storage: {
    name: STORAGE_NAME.SQL,
    host: process.env.STORAGE_HOST,
    port: SERVER_PORT.SQL_PORT,
  },
};

const test = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || SERVER_PORT.APP_PORT,
  },
  storage: {
    name: process.env.TEST_STORAGE,
    port: SERVER_PORT.REDIS_PORT,
  },
};

const config = {
  memory,
  redis,
  test,
  sql,
};

const envConfig = config[env];
export { envConfig };

const DB_ACCESS = {
  host: process.env.STORAGE_HOST,
  user: 'root',
  password: 'Timafifa14',
  port: SERVER_PORT.SQL_PORT,
  database: 'lab',
  dialect: 'mysql',
};

export { DB_ACCESS };
