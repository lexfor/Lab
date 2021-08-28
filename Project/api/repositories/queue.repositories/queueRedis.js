import { promisify } from 'util';

export default class QueueRedis {
  constructor(redisClient) {
    this.client = redisClient;
  }

  async push(patient) {
    const rpushAsync = promisify(this.client.rpush).bind(this.client);
    await rpushAsync('queue', patient.id);
    return patient;
  }

  async shift() {
    const result = this.getFirst();
    const lpopAsync = promisify(this.client.lpop).bind(this.client);
    await lpopAsync('queue');
    return result;
  }

  async getFirst() {
    const lindexAsync = promisify(this.client.lindex).bind(this.client);
    const result = await lindexAsync('queue', 0);
    return result;
  }

  async getAll() {
    const lrangeAsync = promisify(this.client.lrange).bind(this.client);
    const result = await lrangeAsync('queue', 0, -1);

    if (result.length === 0) {
      return [];
    }
    return result;
  }
}
