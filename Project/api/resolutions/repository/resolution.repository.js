import { v1 as uuidv1 } from 'uuid';
import { promisify } from 'util';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class ResolutionRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create(values) {
    try {
      const uuid = uuidv1();
      const data = {
        ...values,
        id: uuid,
        updatedTime: new Date().getTime(),
      };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO resolutions SET ? ';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async update(resolution, resolutionValue, time) {
    try {
      const data = [{
        value: resolutionValue,
        delay: time,
        updatedTime: new Date().getTime(),
      }, resolution.id];
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'UPDATE resolutions SET $1 WHERE id = $2';
      await queryAsync(sql, data);
      return { id: resolution.id, name: resolutionValue };
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getAllResolutions(patientID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM resolutions WHERE patient_id = ?';
      let result = (await queryAsync(sql, patientID));
      result = result.filter((item) => new Date().getTime() - item.updatedTime < item.delay);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async delete(resolutionID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM resolutions WHERE id = ?';
      await queryAsync(sql, resolutionID);
      return { id: resolutionID };
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getAll() {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM resolutions';
      const result = await queryAsync(sql);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }
}

export { ResolutionRepository };
