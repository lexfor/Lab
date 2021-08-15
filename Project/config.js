import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV;

const memory = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || 3000,
  },
  storage: {
    name: 'memory',
    port: 6379,
  },
};

const redis = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || 3000,
  },
  storage: {
    name: 'redis',
    port: 6379,
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
};

const envConfig = config[env];
export { envConfig };
