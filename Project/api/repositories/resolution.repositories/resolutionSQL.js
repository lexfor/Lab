import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import { NOT_AVAILABLE } from '../../../constants.js';
import { createConnection } from '../../../DBconnection.js';

export default class ResolutionSQL {
  async create(patient, resolutionValue, time) {
    try {
      const key = uuidv4();
      const connection = createConnection();
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'INSERT INTO resolutions (id, value, delay, updatedTime, patient_id) VALUES ('
        + `'${key}', `
        + `'${resolutionValue}', `
        + `${time}, `
        + `'${new Date().getTime()}', `
        + `'${patient.id}'
      )`;
      await queryAsync(sql);
      connection.end();
      return { id: key, value: resolutionValue, patient_id: patient.id };
    } catch (e) {
      return e.message;
    }
  }

  async update(resolution, resolutionValue, time) {
    try {
      const connection = createConnection();
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'UPDATE resolutions SET '
        + `value = '${resolutionValue}', `
        + `delay = ${time}, `
        + `updatedTime = ${new Date()} `
        + 'WHERE '
        + `id = '${resolution.id}'`;
      await queryAsync(sql);
      connection.end();
      return { id: resolution.id, name: resolutionValue };
    } catch (e) {
      return e.message;
    }
  }

  async get(patient) {
    try {
      const connection = createConnection();
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'SELECT * FROM resolutions '
        + 'WHERE '
        + `patient_id = '${patient.id}'`;
      const result = await queryAsync(sql);
      connection.end();
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
      const connection = createConnection();
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'UPDATE resolutions SET '
        + `value = '${NOT_AVAILABLE}' `
        + 'WHERE '
        + `id = '${resolution.id}'`;
      await queryAsync(sql);
      connection.end();
      return resolution;
    } catch (e) {
      return e.message;
    }
  }

  async getAll() {
    try {
      const connection = createConnection();
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'SELECT * FROM resolutions';
      const result = await queryAsync(sql);
      connection.end();
      return result;
    } catch (e) {
      return e.message;
    }
  }
}
