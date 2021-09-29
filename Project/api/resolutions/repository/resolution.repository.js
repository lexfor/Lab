import { v1 as uuidv1 } from 'uuid';
import { promisify } from 'util';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class ResolutionRepository {
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * Create new resolution
   * @param {object} values
   * @returns {Promise<object>} resolution data
   */
  async createResolution(values) {
    try {
      const uuid = uuidv1();
      const data = {
        ...values,
        id: uuid,
        createdTime: new Date().getTime(),
      };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO resolutions SET ? ';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Update resolution
   * @param {object} resolution
   * @param {string} resolutionValue
   * @param {string} time
   * @returns {Promise<object>} resolution data
   */
  async updateResolution(resolution, resolutionValue, time) {
    try {
      const data = [{
        value: resolutionValue,
        delay: time,
        createdTime: new Date().getTime(),
      }, resolution.id];
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'UPDATE resolutions SET $1 WHERE id = $2';
      await queryAsync(sql, data);
      return { id: resolution.id, name: resolutionValue };
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Get all patients resolutions
   * @param {string} patientID
   * @returns {Promise<array>} patient resolution data array
   */
  async getAllResolutions(patientID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM resolutions WHERE patient_id = ?';
      let result = (await queryAsync(sql, patientID));
      result = result.filter((item) => new Date().getTime() - item.createdTime < item.delay);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Delete resolution
   * @param {string} resolutionID
   * @returns {Promise<object>} resolution data
   */
  async deleteResolution(resolutionID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM resolutions WHERE id = ?';
      await queryAsync(sql, resolutionID);
      return { id: resolutionID };
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }
}

export { ResolutionRepository };
