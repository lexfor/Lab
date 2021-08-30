import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { createConnection } from '../../helpers/DBconnection.js';

export default class PatientSQL {
  async create(patientName) {
    try {
      const key = uuidv4();
      const connection = createConnection();
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'INSERT INTO patients (id, name) VALUES ( '
        + `'${key}', `
        + `'${patientName}' )`;
      await queryAsync(sql);
      connection.end();
      return { id: key, name: patientName };
    } catch (e) {
      return e.message;
    }
  }

  async update(patient, patientName) {
    try {
      const connection = createConnection();
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'UPDATE patients SET '
        + `name = '${patientName}' `
        + 'WHERE '
        + `id = '${patient.id}'`;
      await queryAsync(sql);
      connection.end();
      return { id: patient.id, name: patientName };
    } catch (e) {
      return e.message;
    }
  }

  async getByName(patientName) {
    try {
      const connection = createConnection();
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'SELECT * FROM patients '
        + 'WHERE '
        + `name = '${patientName}'`;
      const result = await queryAsync(sql);
      connection.end();
      return result[0];
    } catch (e) {
      return e.message;
    }
  }

  async getByID(patientID) {
    try {
      const connection = createConnection();
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'SELECT * FROM patients '
        + 'WHERE '
        + `id = '${patientID}'`;
      const result = await queryAsync(sql);
      connection.end();
      return result[0];
    } catch (e) {
      return e.message;
    }
  }

  async delete(patient) {
    try {
      const connection = createConnection();
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'DELETE FROM patients '
        + 'WHERE '
        + `id = '${patient.id}'`;
      await queryAsync(sql);
      connection.end();
      return patient;
    } catch (e) {
      return e.message;
    }
  }

  async getAllNames() {
    try {
      const connection = createConnection();
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'SELECT name FROM patients';
      const result = await queryAsync(sql);
      connection.end();
      return result.map((item) => item.name);
    } catch (e) {
      return e.message;
    }
  }
}
