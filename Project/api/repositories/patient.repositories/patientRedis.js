import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

export default class PatientRedis {
  constructor(client) {
    this.client = client;
  }

  async create(patientName) {
    const uuid = uuidv4();
    const hsetAsync = promisify(this.client.hset).bind(this.client);
    await hsetAsync('names', uuid, patientName);
    const result = { id: uuid, name: patientName };
    return result;
  }

  async update(patient, value) {
    const hsetAsync = promisify(this.client.hset).bind(this.client);
    const hdelAsync = promisify(this.client.hdel).bind(this.client);
    await hdelAsync('names', patient.id);
    await hsetAsync('names', patient.id, value);
    const result = { id: patient.id, name: value };
    return result;
  }

  async getByName(patientName) {
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

  async getByID(patientID) {
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
