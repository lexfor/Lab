import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

export default class PatientRedis {
  constructor(client) {
    this.client = client;
  }

  async create(value) {
    const key = uuidv4();
    const hsetAsync = promisify(this.client.hset).bind(this.client);
    await hsetAsync('names', key, value);
    return key;
  }

  async update(patientID, value) {
    const hsetAsync = promisify(this.client.hset).bind(this.client);
    const hdelAsync = promisify(this.client.hdel).bind(this.client);
    await hdelAsync('names', patientID);
    await hsetAsync('names', patientID, value);
    return 'updated';
  }

  async find(patientName) {
    const hgetallAsync = promisify(this.client.hgetall).bind(this.client);
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
      const hgetAsync = promisify(this.client.hget).bind(this.client);
      const result = await hgetAsync('names', patientID);
      return result;
    } catch (e) {
      console.log(e.message);
      return '';
    }
  }

  async getResolutionID(patientID) {
    try {
      const hgetAsync = promisify(this.client.hget).bind(this.client);
      const result = await hgetAsync('resolutions', patientID);
      return result;
    } catch (e) {
      console.log(e.message);
      return '';
    }
  }

  async delete(patientID) {
    try {
      const hdelAsync = promisify(this.client.hdel).bind(this.client);
      await hdelAsync('names', patientID);
    } catch (e) {
      console.log(e.message);
    }
  }

  async getAllNames() {
    const hvalsAsync = promisify(this.client.hvals).bind(this.client);
    const result = await hvalsAsync('names');
    return result;
  }
}
