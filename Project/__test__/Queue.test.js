import QueueService from '../api/service/QueueService.js';
import { queueInMemoryStorage } from '../api/repositories/queueStorage.js';
import { queueInRedisStorage } from '../api/repositories/queueRedis.js';
import { envConfig } from '../config.js';

let queueStorage;

switch (envConfig.storage.name) {
  case 'redis':
    queueStorage = queueInRedisStorage;
    break;
  default:
    queueStorage = queueInMemoryStorage;
}

describe('queue service', () => {
  const queue = new QueueService(queueStorage);
  test('add patient in queue', async () => {
    const result = await queue.push('Timofei');
    expect(result).toEqual('pushed');
  });

  test('get first patient from queue', async () => {
    const result = await queue.getCurrent();
    expect(result).toEqual('Timofei');
  });

  test('pop patient from queue', async () => {
    const result = await queue.pop();
    expect(result).toEqual('shifted');
  });

  test('pop patient from empty queue', async () => {
    const result = await queue.pop();
    expect(result).toEqual('shifted');
  });

  test('get patient from empty queue', async () => {
    const result = await queue.getCurrent();
    expect(result).toBeNull();
  });
});
