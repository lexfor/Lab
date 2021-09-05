import redis from 'redis';
import { envConfig } from '../../config';

const client = redis.createClient({
  host: envConfig.queueStorage.host,
  port: envConfig.queueStorage.port,
});

export { client };
