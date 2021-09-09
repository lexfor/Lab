import { promisify } from 'util';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class QueueRepository {
  constructor(redisClient) {
    this.client = redisClient;
  }

  async push(patientID) {
    try {
      const rpushAsync = promisify(this.client.rpush).bind(this.client);
      await rpushAsync('queue', patientID);
      return patientID;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async shift() {
    try {
      const result = this.getFirst();
      const lpopAsync = promisify(this.client.lpop).bind(this.client);
      await lpopAsync('queue');
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getFirst() {
    try {
      const lindexAsync = promisify(this.client.lindex).bind(this.client);
      const result = await lindexAsync('queue', 0);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  async getAll() {
    try {
      const lrangeAsync = promisify(this.client.lrange).bind(this.client);
      const result = await lrangeAsync('queue', 0, -1);

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
