import { v1 as uuidv1 } from 'uuid';
import { promisify } from 'util';

class ResolutionRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create(patientID, resolutionValue, time) {
    try {
      const uuid = uuidv1();
      const data = {
        id: uuid,
        value: resolutionValue,
        delay: time,
        updatedTime: new Date().getTime(),
        patient_id: patientID,
      };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO resolutions SET ? ';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      return e.message;
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
      const sql = 'UPDATE resolutions SET ? WHERE id = ?';
      await queryAsync(sql, data);
      return { id: resolution.id, name: resolutionValue };
    } catch (e) {
      return e.message;
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
      return e.message;
    }
  }

  async delete(patientID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM resolutions WHERE patient_id = ?';
      await queryAsync(sql, patientID);
      return { id: patientID };
    } catch (e) {
      return e.message;
    }
  }

  async getAll() {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM resolutions';
      const result = await queryAsync(sql);
      return result;
    } catch (e) {
      return e.message;
    }
  }
}

export { ResolutionRepository };