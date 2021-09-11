import { promisify } from 'util';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class QueueRepository {
  constructor(redisClient) {
    this.client = redisClient;
  }

  async push(patientID, doctorName, doctorType) {
    try {
      const rpushAsync = promisify(this.client.rpush).bind(this.client);
      await rpushAsync(`queueTo${doctorName}-${doctorType}`, patientID);
      return patientID;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async shift(doctorName, doctorType) {
    try {
      const result = this.getFirst(doctorName, doctorType);
      const lpopAsync = promisify(this.client.lpop).bind(this.client);
      await lpopAsync(`queueTo${doctorName}-${doctorType}`);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getFirst(doctorName, doctorType) {
    try {
      const lindexAsync = promisify(this.client.lindex).bind(this.client);
      const result = await lindexAsync(`queueTo${doctorName}-${doctorType}`, 0);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getAll(doctorName, doctorType) {
    try {
      const lrangeAsync = promisify(this.client.lrange).bind(this.client);
      const result = await lrangeAsync(`queueTo${doctorName}-${doctorType}`, 0, -1);

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
