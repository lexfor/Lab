import redis from 'redis';
import { promisify } from 'util';

import { envConfig } from '../../config.js';

let client;
if (envConfig.queueStorage.name === 'redis') {
  client = redis.createClient({
    host: envConfig.queueStorage.host,
    port: envConfig.queueStorage.port,
  });

  client.on('error', (error) => {
    console.error(error);
  });

  client.select(0);
  client.flushdb();
}

class RedisQueue {
  async push(id) {
    const rpushAsync = promisify(client.rpush).bind(client);
    await rpushAsync('queue', id);
    return 'pushed';
  }

  async shift() {
    const lpopAsync = promisify(client.lpop).bind(client);
    await lpopAsync('queue');
    return 'shifted';
  }

  async getFirst() {
    const lindexAsync = promisify(client.lindex).bind(client);
    const result = await lindexAsync('queue', 0);
    return result;
  }

  async getAll() {
    const lrangeAsync = promisify(client.lrange).bind(client);
    const result = await lrangeAsync('queue', 0, -1);

    if (result.length === 0) {
      return [];
    }
    return result;
  }
}

const queueInRedisStorage = new RedisQueue();
export { queueInRedisStorage };
