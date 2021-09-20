import { promisify } from 'util';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class DoctorRepository {
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * Get all doctors specializations
   * @returns {array} all specializations
   */
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

  /**
   * Get all doctors by specializations
   * @param {string} specializationsID
   * @returns {array} array of doctors
   */
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

  /**
   * Get doctor by ID
   * @param {string} userID
   * @returns {object} founded doctor
   */
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
