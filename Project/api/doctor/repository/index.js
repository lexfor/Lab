import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

export default class DoctorRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create(userID, doctorName, doctorMail, type) {
    try {
      const data = {
        id: uuidv4(),
        name: doctorName,
        mail: doctorMail,
        type,
        // user_id: userID,
      };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO doctors SET ?';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      console.error(e);
      return e.message;
    }
  }

  async findDoctorByLogin(login) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM users WHERE login = ?';
      const result = await queryAsync(sql, login);
      return result[0];
    } catch (e) {
      console.error(e);
      return e.message;
    }
  }

  async getAllSpecializations() {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM specializations';
      const result = await queryAsync(sql);
      return result;
    } catch (e) {
      console.error(e);
      return e.message;
    }
  }

  async allDoctorsBySpecializations(specializationsID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
      SELECT * FROM doctors
      JOIN doctor_specialization
      ON doctors.doctorID = doctor_specialization.doctorID 
      WHERE specializationID = '${specializationsID}'`;
      const result = await queryAsync(sql);
      return result;
    } catch (e) {
      console.error(e);
      return e.message;
    }
  }

  async getDoctorByID(userID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
      SELECT * FROM doctors
      JOIN doctor_specialization
      ON doctor_specialization.doctorID = doctors.doctorID 
      JOIN specializations
      ON doctor_specialization.specializationID = specializations.specializationID
      WHERE user_id = '${userID}'`;
      const result = await queryAsync(sql);
      return result;
    } catch (e) {
      console.error(e);
      return e.message;
    }
  }
}
