import redis from 'redis';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

import { envConfig } from '../../config.js';
import { NOT_AVAILABLE } from '../../constants.js';

let client;
if (envConfig.storage === 'redis' || process.env.TEST_STORAGE === 'redis') {
  client = redis.createClient(envConfig.storage.port);

  client.on('error', (error) => {
    console.error(error);
  });

  client.select(2);
  client.flushdb();
}

class ResolutionRedis {
  async create(resolutionValue, time) {
    const key = uuidv4();
    const setAsync = promisify(client.set).bind(client);
    const expireAsync = promisify(client.expire).bind(client);
    setAsync(key, resolutionValue);
    if (time) {
      expireAsync(key, time / 1000);
    }
    return key;
  }

  async update(resolutionID, resolutionValue, time) {
    const setAsync = promisify(client.set).bind(client);
    const expireAsync = promisify(client.expire).bind(client);
    setAsync(resolutionID, resolutionValue);
    if (time) {
      expireAsync(resolutionID, time / 1000);
    }
  }

  async get(resolutionID) {
    const getAsync = promisify(client.get).bind(client);
    const result = await getAsync(resolutionID);
    return result;
  }

  async delete(resolutionID) {
    const setAsync = promisify(client.set).bind(client);
    setAsync(resolutionID, NOT_AVAILABLE);
  }

  async getAll() {
    const keysAsync = promisify(client.keys).bind(client);
    const result = await keysAsync('*');
    return result;
  }
}

const resolutionInRedisStorage = new ResolutionRedis();
export { resolutionInRedisStorage };
