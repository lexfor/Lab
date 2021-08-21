import redis from 'redis';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

import { envConfig } from '../../config.js';

let client;
if (envConfig.storage === 'redis' || process.env.TEST_STORAGE === 'redis') {
  client = redis.createClient(envConfig.storage.port);

  client.on('error', (error) => {
    console.error(error);
  });

  client.select(1);
  client.flushdb();
}

class PatientRedis {
  async create(value) {
    const key = uuidv4();
    const hsetAsync = promisify(client.hset).bind(client);
    await hsetAsync('names', key, value);
    await hsetAsync('resolutions', key, '');
    return key;
  }

  async update(patientID, value, resolutionID) {
    const hsetAsync = promisify(client.hset).bind(client);
    const hdelAsync = promisify(client.hdel).bind(client);
    await hdelAsync('names', patientID);
    await hsetAsync('names', patientID, value);
    await hdelAsync('resolutions', patientID);
    await hsetAsync('resolutions', patientID, resolutionID);
    return 'updated';
  }

  async find(patientName) {
    const hgetallAsync = promisify(client.hgetall).bind(client);
    const keysAndValuesObject = await hgetallAsync('names');
    const keysAndValuesArray = Object.entries(keysAndValuesObject);
    let result;
    keysAndValuesArray.forEach((item) => {
      if (item[1] === patientName) {
        [result] = item;
      }
    });
    return result;
  }

  async get(patientID) {
    try {
      const hgetAsync = promisify(client.hget).bind(client);
      const result = await hgetAsync('names', patientID);
      return result;
    } catch (e) {
      console.log(e.message);
      return '';
    }
  }

  async getResolutionID(patientID) {
    try {
      const hgetAsync = promisify(client.hget).bind(client);
      const result = await hgetAsync('resolutions', patientID);
      return result;
    } catch (e) {
      console.log(e.message);
      return '';
    }
  }

  async delete(patientID) {
    try {
      const hdelAsync = promisify(client.hdel).bind(client);
      await hdelAsync('names', patientID);
      await hdelAsync('resolutions', patientID);
    } catch (e) {
      console.log(e.message);
    }
  }

  async getAllNames() {
    const hvalsAsync = promisify(client.hvals).bind(client);
    const result = await hvalsAsync('names');
    return result;
  }
}

const patientInRedisStorage = new PatientRedis();
export { patientInRedisStorage };
