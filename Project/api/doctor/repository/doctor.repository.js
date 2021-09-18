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
      ON doctors.id = doctor_specialization.doctor_id 
      WHERE doctor_specialization.specialization_id = ?`;
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
      ON doctor_specialization.doctor_id = doctors.id 
      INNER JOIN specializations
      ON doctor_specialization.specialization_id = specializations.id
      WHERE user_id = ?`;
      const result = await queryAsync(sql, userID);
      return result[0];
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }
}

export { DoctorRepository };
