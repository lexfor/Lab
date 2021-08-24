import redis from 'redis';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

import { envConfig } from '../../config.js';
import { NOT_AVAILABLE } from '../../constants.js';

let client;
if (envConfig.storage.name === 'redis') {
  client = redis.createClient({ host: envConfig.storage.host, port: envConfig.storage.port });

  client.on('error', (error) => {
    console.error(error);
  });

  client.select(2);
  client.flushdb();
}

class ResolutionRedis {
  async create(patientID, resolutionValue, time) {
    const key = uuidv4();
    const setAsync = promisify(client.set).bind(client);
    const expireAsync = promisify(client.expire).bind(client);
    const hsetAsync = promisify(client.hset).bind(client);
    await hsetAsync('patient', key, patientID);
    setAsync(key, resolutionValue);
    if (time) {
      expireAsync(key, time / 1000);
    }
    return key;
  }

  async update(resolutionID, resolutionValue, time) {
    const setAsync = promisify(client.set).bind(client);
    const expireAsync = promisify(client.expire).bind(client);
    const hsetAsync = promisify(client.hset).bind(client);
    const hdelAsync = promisify(client.hdel).bind(client);
    await hdelAsync('patient', resolutionID);
    await hsetAsync('patient', resolutionID, resolutionValue);
    setAsync(resolutionID, resolutionValue);
    if (time) {
      expireAsync(resolutionID, time / 1000);
    }
  }

  async getResolutionID(patientID) {
    const hgetallAsync = promisify(client.hgetall).bind(client);
    const keysAndValuesObject = await hgetallAsync('patient');
    if (!keysAndValuesObject) {
      return '';
    }
    const keysAndValuesArray = Object.entries(keysAndValuesObject);
    let result;
    keysAndValuesArray.forEach((item) => {
      if (item[1] === patientID) {
        [result] = item;
      }
    });
    return result;
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
