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
    const patient = { id: key, name: value };
    return patient;
  }

  async update(patient, value) {
    const hsetAsync = promisify(this.client.hset).bind(this.client);
    const hdelAsync = promisify(this.client.hdel).bind(this.client);
    await hdelAsync('names', patient.id);
    await hsetAsync('names', patient.id, value);
    const patientObject = { id: patient.id, name: value };
    return patientObject;
  }

  async find(patientName) {
    const hgetallAsync = promisify(this.client.hgetall).bind(this.client);
    const keysAndValuesObject = await hgetallAsync('names');
    const keysAndValuesArray = Object.entries(keysAndValuesObject);
    const result = {};
    keysAndValuesArray.forEach((item) => {
      if (item[1] === patientName) {
        [result.id, result.name] = item;
      }
    });
    return result;
  }

  async get(patientID) {
    try {
      const hgetAsync = promisify(this.client.hget).bind(this.client);
      const result = {};
      result.name = await hgetAsync('names', patientID);
      result.id = patientID;
      return result;
    } catch (e) {
      console.log(e.message);
      return '';
    }
  }

  async delete(patient) {
    try {
      const hdelAsync = promisify(this.client.hdel).bind(this.client);
      await hdelAsync('names', patient.id);
      return patient;
    } catch (e) {
      console.log(e.message);
      return '';
    }
  }

  async getAllNames() {
    const hvalsAsync = promisify(this.client.hvals).bind(this.client);
    const result = await hvalsAsync('names');
    return result;
  }
}
