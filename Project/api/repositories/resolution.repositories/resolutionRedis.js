import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { NOT_AVAILABLE } from '../../../constants.js';

export default class ResolutionRedis {
  constructor(client) {
    this.client = client;
  }

  async create(patientID, resolutionValue, time) {
    const key = uuidv4();
    const setAsync = promisify(this.client.set).bind(this.client);
    const expireAsync = promisify(this.client.expire).bind(this.client);
    const hsetAsync = promisify(this.client.hset).bind(this.client);
    await hsetAsync('patient', key, patientID);
    setAsync(key, resolutionValue);
    if (time) {
      expireAsync(key, time / 1000);
    }
    return key;
  }

  async update(resolutionID, resolutionValue, time) {
    const setAsync = promisify(this.client.set).bind(this.client);
    const expireAsync = promisify(this.client.expire).bind(this.client);
    const hsetAsync = promisify(this.client.hset).bind(this.client);
    const hdelAsync = promisify(this.client.hdel).bind(this.client);
    await hdelAsync('patient', resolutionID);
    await hsetAsync('patient', resolutionID, resolutionValue);
    setAsync(resolutionID, resolutionValue);
    if (time) {
      expireAsync(resolutionID, time / 1000);
    }
  }

  async getResolutionID(patientID) {
    const hgetallAsync = promisify(this.client.hgetall).bind(this.client);
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
    const getAsync = promisify(this.client.get).bind(this.client);
    const result = await getAsync(resolutionID);
    return result;
  }

  async delete(resolutionID) {
    const setAsync = promisify(this.client.set).bind(this.client);
    setAsync(resolutionID, NOT_AVAILABLE);
  }

  async getAll() {
    const keysAsync = promisify(this.client.keys).bind(this.client);
    const result = await keysAsync('*');
    return result;
  }
}
