import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { NOT_AVAILABLE } from '../../../constants.js';

export default class ResolutionRedis {
  constructor(client) {
    this.client = client;
  }

  async create(patient, resolutionValue, time) {
    const key = uuidv4();
    const setAsync = promisify(this.client.set).bind(this.client);
    const expireAsync = promisify(this.client.expire).bind(this.client);
    const hsetAsync = promisify(this.client.hset).bind(this.client);

    await hsetAsync('patient', key, patient.id);
    await setAsync(key, resolutionValue);
    if (time) {
      expireAsync(key, time / 1000);
    }

    return {
      id: key,
      name: resolutionValue,
      patient_id: patient.id,
    };
  }

  async update(resolution, resolutionValue, time) {
    const setAsync = promisify(this.client.set).bind(this.client);
    const expireAsync = promisify(this.client.expire).bind(this.client);
    const hsetAsync = promisify(this.client.hset).bind(this.client);
    const hdelAsync = promisify(this.client.hdel).bind(this.client);

    await hdelAsync('patient', resolution.id);
    await hsetAsync('patient', resolution.id, resolutionValue);
    await setAsync(resolution.id, resolutionValue);
    if (time) {
      expireAsync(resolution.id, time / 1000);
    }
  }

  async get(patient) {
    const hgetallAsync = promisify(this.client.hgetall).bind(this.client);
    const getAsync = promisify(this.client.get).bind(this.client);
    const keysAndValuesObject = await hgetallAsync('patient');

    if (!keysAndValuesObject) {
      return NOT_AVAILABLE;
    }
    const keysAndValuesArray = Object.entries(keysAndValuesObject);
    const result = {};

    keysAndValuesArray.forEach((item) => {
      if (item[1] === patient.id) {
        [result.id, result.patient_id] = item;
      }
    });

    result.value = await getAsync(result.id);
    return result;
  }

  async delete(resolution) {
    const setAsync = promisify(this.client.set).bind(this.client);
    setAsync(resolution.id, NOT_AVAILABLE);
  }

  async getAll() {
    const keysAsync = promisify(this.client.keys).bind(this.client);
    const result = await keysAsync('*');
    return result;
  }
}
