import QueueController from '../api/controllers/queueController.js';
import QueueService from '../api/service/QueueService.js';
import PatientsResolutionsService from '../api/service/PatientsResolutionsService.js';
import { queueInMemoryStorage } from '../api/repositories/queueStorage.js';
import { queueInRedisStorage } from '../api/repositories/queueRedis.js';
import { resolutionInRedisStorage } from '../api/repositories/resolutionRedis';
import { resolutionInMemoryStorage } from '../api/repositories/resolutionStorage';
import { envConfig } from '../config.js';
import { STATUSES } from '../constants.js';

let queueStorage;
let resolutionStorage;

switch (envConfig.storage.name) {
  case 'redis':
    queueStorage = queueInRedisStorage;
    resolutionStorage = resolutionInRedisStorage;
    break;
  default:
    queueStorage = queueInMemoryStorage;
    resolutionStorage = resolutionInMemoryStorage;
}

describe('Queue controller', () => {
  const queueService = new QueueService(queueStorage);
  const resolutionService = new PatientsResolutionsService(resolutionStorage);
  const queueController = new QueueController(queueService, resolutionService);
  test('add value in queue', async () => {
    const result = await queueController.addValueInQueue('Tim');
    expect(result.getValue).toEqual('Added');
    expect(result.getStatus).toEqual(STATUSES.Created);
  });

  test('add existed value in queue', async () => {
    const result = await queueController.addValueInQueue('Tim');
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(STATUSES.BadRequest);
  });

  test('get current value from queue', async () => {
    const result = await queueController.getCurrentInQueue();
    expect(result.getValue).toEqual('Tim');
    expect(result.getStatus).toEqual(STATUSES.OK);
  });

  test('pop value from queue', async () => {
    const result = await queueController.takeNextValueInQueue();
    expect(result.getValue).toEqual('shifted');
    expect(result.getStatus).toEqual(STATUSES.OK);
  });

  test('pop value from empty queue', async () => {
    const result = await queueController.takeNextValueInQueue();
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(STATUSES.Unavailable);
  });

  test('get current value from empty queue', async () => {
    const result = await queueController.takeNextValueInQueue();
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(STATUSES.Unavailable);
  });
});
