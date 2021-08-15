import redis from 'redis';
import { promisify } from 'util';

import { envConfig } from '../../config.js';

const client = redis.createClient(envConfig.storage.port);

client.on('error', (error) => {
  console.error(error);
});

client.select(0);
client.flushdb();

class RedisQueue {
  constructor() {
    this.count = 0;
    this.current = 0;
  }

  async push(value) {
    const setAsync = promisify(client.set).bind(client);
    await setAsync(this.count, value);
    this.count += 1;
  }

  async shift() {
    if (this.current === this.count) {
      return;
    }
    await client.del(this.current);
    this.current += 1;
  }

  async getFirst() {
    const getAsync = promisify(client.get).bind(client);
    const result = await getAsync(this.current);
    return result;
  }

  async getAll() {
    const keysAsync = promisify(client.keys).bind(client);
    const mgetAsync = promisify(client.mget).bind(client);
    const result = await keysAsync('*');

    if (result.length === 0) {
      return [];
    }

    const values = await mgetAsync(result);
    return values;
  }
}

const queueInRedisStorage = new RedisQueue();
export { queueInRedisStorage };
