import { promisify } from 'util';
import { v1 as uuidv1 } from 'uuid';

class PatientRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create(userID, patientName, patientBirthday, patientGender, patientMail) {
    try {
      const uuid = uuidv1();
      const data = {
        id: uuid,
        name: patientName,
        birthday: patientBirthday,
        gender: patientGender,
        mail: patientMail,
        user_id: userID,
      };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO patients SET ?';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      return e.message;
    }
  }

  async update(patient, patientName) {
    try {
      const data = [patientName, patient.id];
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'UPDATE patients SET ? WHERE id = ?';
      await queryAsync(sql, data);
      return { id: patient.id, name: patientName };
    } catch (e) {
      return e.message;
    }
  }

  async getByName(patientName) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM patients WHERE name = ?';
      const result = await queryAsync(sql, patientName);
      return result[0];
    } catch (e) {
      return e.message;
    }
  }

  async getByID(patientID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM patients WHERE id = ?';
      const result = await queryAsync(sql, patientID);
      return result[0];
    } catch (e) {
      return e.message;
    }
  }

  async getByUserID(userID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM patients WHERE user_id = ?';
      const result = await queryAsync(sql, userID);
      return result[0];
    } catch (e) {
      return e.message;
    }
  }

  async delete(patientID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM patients WHERE id = ?';
      await queryAsync(sql, patientID);
      return { id: patientID };
    } catch (e) {
      return e.message;
    }
  }

  async getAllIDs() {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT id FROM patients';
      const result = await queryAsync(sql);
      return result.map((item) => item.id);
    } catch (e) {
      return e.message;
    }
  }

  async getAllNames() {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT name FROM patients';
      const result = await queryAsync(sql);
      return result.map((item) => item.name);
    } catch (e) {
      return e.message;
    }
  }
}

export { PatientRepository };
