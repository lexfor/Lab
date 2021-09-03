import { promisify } from 'util';

export default class QueueRedis {
  constructor(redisClient) {
    this.client = redisClient;
  }

  async push(patient) {
    try {
      const rpushAsync = promisify(this.client.rpush).bind(this.client);
      await rpushAsync('queue', patient.id);
      return patient;
    } catch (e) {
      return e.message;
    }
  }

  async shift() {
    try {
      const result = this.getFirst();
      const lpopAsync = promisify(this.client.lpop).bind(this.client);
      await lpopAsync('queue');
      return result;
    } catch (e) {
      return e.message;
    }
  }

  async getFirst() {
    try {
      const lindexAsync = promisify(this.client.lindex).bind(this.client);
      const result = await lindexAsync('queue', 0);
      return result;
    } catch (e) {
      return e.message;
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
      return e.message;
    }
  }
}
