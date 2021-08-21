import dotenv from 'dotenv';
import { STORAGE_NAME } from './constants.js';

dotenv.config();

const env = process.env.NODE_ENV;

const memory = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || 3000,
  },
  storage: {
    name: STORAGE_NAME.MEMORY,
    port: 6379,
  },
};

const redis = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || 3000,
  },
  storage: {
    name: STORAGE_NAME.REDIS,
    port: 6379,
  },
};

const sql = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || 3000,
  },
  storage: {
    name: STORAGE_NAME.SQL,
    port: 3306,
  },
};

const test = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || 3000,
  },
  storage: {
    name: process.env.TEST_STORAGE,
    port: 6379,
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
  host: 'localhost',
  user: 'root',
  password: 'Timafifa14',
  port: 3306,
  database: 'lab',
  dialect: 'mysql',
};

export { DB_ACCESS };
