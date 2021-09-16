import { promisify } from 'util';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class DoctorRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async getAllSpecializations() {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM specializations';
      const result = await queryAsync(sql);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async allDoctorsBySpecializations(specializationsID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
      SELECT * FROM doctors
      JOIN doctor_specialization
      ON doctors.doctorID = doctor_specialization.doctorID 
      WHERE doctor_specialization.specializationID = ?`;
      const result = await queryAsync(sql, specializationsID);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
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
      WHERE user_id = ?`;
      const result = await queryAsync(sql, userID);
      return result[0];
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }
}

export { DoctorRepository };
