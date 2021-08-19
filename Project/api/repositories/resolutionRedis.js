import redis from 'redis';
import { promisify } from 'util';

import { envConfig } from '../../config.js';

const client = redis.createClient(envConfig.storage.port);

client.on('error', (error) => {
  console.error(error);
});

client.select(1);
client.flushdb();

class ResolutionRedis {
  async set(value, resolution, time) {
    const timeInSeconds = time / 1000;
    const setAsync = promisify(client.set).bind(client);
    await setAsync(value, resolution);
    if (time) {
      const expireAsync = promisify(client.expire).bind(client);
      await expireAsync(value, timeInSeconds);
    }
  }

  async get(value) {
    const getAsync = promisify(client.get).bind(client);
    const result = await getAsync(value);
    return result;
  }

  async has(value) {
    const existsAsync = promisify(client.exists).bind(client);
    const result = await existsAsync(value);
    return result;
  }

  async getAll() {
    const keysAsync = promisify(client.keys).bind(client);
    const result = await keysAsync('*');
    return result;
  }
}

const resolutionInRedisStorage = new ResolutionRedis();
export { resolutionInRedisStorage };
