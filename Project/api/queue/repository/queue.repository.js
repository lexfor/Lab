import { promisify } from 'util';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class QueueRepository {
  constructor(redisClient) {
    this.client = redisClient;
  }

  async push(patientID, doctorID) {
    try {
      const rpushAsync = promisify(this.client.rpush).bind(this.client);
      await rpushAsync(`queueTo${doctorID}`, patientID);
      return patientID;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async shift(doctorID) {
    try {
      const result = this.getFirst(doctorID);
      const lpopAsync = promisify(this.client.lpop).bind(this.client);
      await lpopAsync(`queueTo${doctorID}`);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getFirst(doctorID) {
    try {
      const lindexAsync = promisify(this.client.lindex).bind(this.client);
      const result = await lindexAsync(`queueTo${doctorID}`, 0);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getAll(doctorID) {
    try {
      const lrangeAsync = promisify(this.client.lrange).bind(this.client);
      const result = await lrangeAsync(`queueTo${doctorID}`, 0, -1);

      if (result.length === 0) {
        return [];
      }
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }
}

export { QueueRepository };
