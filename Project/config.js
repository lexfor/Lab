import dotenv from 'dotenv';
import { SERVER_PORT } from './constants';

dotenv.config();

const env = process.env.NODE_ENV;

const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || SERVER_PORT.APP_PORT,
  },

  queueStorage: {
    host: process.env.QUEUE_HOST,
    port: SERVER_PORT.REDIS_PORT,
  },

  storage: {
    host: process.env.STORAGE_HOST,
    port: SERVER_PORT.SQL_PORT,
  },
};

const config = {
  dev,
};

const envConfig = config[env];
export { envConfig };

const DB_ACCESS = {
  host: process.env.STORAGE_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: SERVER_PORT.SQL_PORT,
  database: process.env.DB_DATABASE,
  dialect: 'mysql',
};

export { DB_ACCESS };
