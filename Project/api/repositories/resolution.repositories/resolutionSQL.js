import { v1 as uuidv1 } from 'uuid';
import { promisify } from 'util';
import { NOT_AVAILABLE } from '../../../constants.js';

export default class ResolutionSQL {
  constructor(connection) {
    this.connection = connection;
  }

  async create(patient, resolutionValue, time) {
    try {
      const uuid = uuidv1();
      const data = {
        id: uuid,
        value: resolutionValue,
        delay: time,
        updatedTime: new Date().getTime(),
        patient_id: patient.id,
      };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO resolutions SET ? ';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      return e.message;
    }
  }

  async update(resolution, resolutionValue, time) {
    try {
      const data = [{
        value: resolutionValue,
        delay: time,
        updatedTime: new Date().getTime(),
      }, resolution.id];
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'UPDATE resolutions SET ? WHERE id = ?';
      await queryAsync(sql, data);
      return { id: resolution.id, name: resolutionValue };
    } catch (e) {
      return e.message;
    }
  }

  async get(patient) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM resolutions WHERE patient_id = ?';
      const result = await queryAsync(sql, patient.id);
      if (!result[0]) {
        return { value: NOT_AVAILABLE };
      }
      if (new Date().getTime() - result[0].updatedTime > result[0].delay) {
        return { value: NOT_AVAILABLE };
      }
      return result[0];
    } catch (e) {
      return e.message;
    }
  }

  async delete(resolution) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM resolutions WHERE id = ?';
      await queryAsync(sql, resolution.id);
      return resolution;
    } catch (e) {
      return e.message;
    }
  }

  async getAll() {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM resolutions';
      const result = await queryAsync(sql);
      return result;
    } catch (e) {
      return e.message;
    }
  }
}
