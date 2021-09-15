import { promisify } from 'util';
import { v1 as uuidv1 } from 'uuid';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class PatientRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create(patientData) {
    try {
      const uuid = uuidv1();
      const data = { id: uuid, ...patientData };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO patients SET ?';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async update(patient, patientName) {
    try {
      const data = [patientName, patient.id];
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'UPDATE patients SET $1 WHERE id = $2';
      await queryAsync(sql, data);
      return { id: patient.id, name: patientName };
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getByName(patientName) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM patients WHERE name = ?';
      const result = await queryAsync(sql, patientName);
      return result[0];
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getByID(patientID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM patients WHERE id = ?';
      const result = await queryAsync(sql, patientID);
      return result[0];
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getByUserID(userID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM patients WHERE user_id = ?';
      const result = await queryAsync(sql, userID);
      return result[0];
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async delete(patientID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM patients WHERE id = ?';
      await queryAsync(sql, patientID);
      return { id: patientID };
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getAllIDs() {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT id FROM patients';
      const result = await queryAsync(sql);
      return result.map((item) => item.id);
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getAllNames() {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT name FROM patients';
      const result = await queryAsync(sql);
      return result.map((item) => item.name);
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getAllPatients(patientInfo) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
      SELECT * 
      FROM patients
      WHERE name LIKE'%${patientInfo}%'
      OR mail LIKE '%${patientInfo}%'`;
      const result = await queryAsync(sql);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }
}

export { PatientRepository };
