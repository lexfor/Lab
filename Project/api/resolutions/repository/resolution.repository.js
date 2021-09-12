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

  async get(patientID) {
    try {
      const resolution = { value: '' };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM resolutions WHERE patient_id = ?';
      const result = await queryAsync(sql, patientID);
      result.forEach((item) => {
        if (item.value) {
          if (new Date().getTime() - item.updatedTime < item.delay) {
            resolution.value += item.value;
            resolution.value += ' | ';
          }
        }
      });
      return resolution;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getAllResolutions(patientID) {
    try {
      const resolution = { value: '' };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM resolutions WHERE patient_id = ?';
      const result = await queryAsync(sql, patientID);
      // result.forEach((item) => {
      //   if (item.value) {
      //     if (new Date().getTime() - item.updatedTime < item.delay) {
      //       resolution.value += item.value;
      //       resolution.value += ' | ';
      //     }
      //   }
      // });
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async delete(patientID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM resolutions WHERE id = ?';
      await queryAsync(sql, patientID);
      return { id: patientID };
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
