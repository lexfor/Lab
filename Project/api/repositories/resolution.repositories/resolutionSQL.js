import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import { NOT_AVAILABLE } from '../../../constants.js';
import { createConnection } from '../../../DBconnection.js';

export default class ResolutionSQL {
  async create(patient, resolutionValue, time) {
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
  }

  async update(resolution, resolutionValue, time) {
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
  }

  async get(patient) {
    const connection = createConnection();
    const queryAsync = promisify(connection.query).bind(connection);
    const sql = 'SELECT * FROM resolutions '
      + 'WHERE '
      + `patient_id = '${patient.id}'`;
    const result = await queryAsync(sql);
    connection.end();
    if (!result[0]) {
      return NOT_AVAILABLE;
    }
    if (new Date().getTime() - result[0].updatedTime > result[0].delay) {
      return NOT_AVAILABLE;
    }
    return result[0];
  }

  async delete(resolution) {
    const connection = createConnection();
    const queryAsync = promisify(connection.query).bind(connection);
    const sql = 'UPDATE resolutions SET '
      + `value = '${NOT_AVAILABLE}' `
      + 'WHERE '
      + `id = '${resolution.id}'`;
    await queryAsync(sql);
    connection.end();
    return resolution;
  }

  async getAll() {
    const connection = createConnection();
    const queryAsync = promisify(connection.query).bind(connection);
    const sql = 'SELECT * FROM resolutions';
    const result = await queryAsync(sql);
    connection.end();
    return result;
  }
}
