const env = process.env.NODE_ENV;

const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || 3000,
  },
};

const config = {
  dev,
};

const envConfig = config[env];
export { envConfig };
