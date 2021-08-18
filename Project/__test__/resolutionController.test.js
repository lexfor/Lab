import ResolutionController from '../api/controllers/resolutionController.js';
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

describe('Resolution controller', () => {

  const queueService = new QueueService(queueStorage);
  const resolutionService = new PatientsResolutionsService(resolutionStorage);
  const resolutionController = new ResolutionController(queueService, resolutionService);

  test('get all processed patients vale with empty storage', async () => {
    const result = await resolutionController.getAllProcessedPatientsValue();
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(STATUSES.Unavailable);
  });

  test('set resolution', async () => {
    await queueService.push('Tim');
    const result = await resolutionController.setResolutionForCurrentPatient({ value: 'All good' });
    expect(result.getValue).toEqual('Accepted');
    expect(result.getStatus).toEqual(STATUSES.Accepted);
  });

  test('set resolution without any patients in queue', async () => {
    await queueService.pop();
    const result = await resolutionController.setResolutionForCurrentPatient('All fine');
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(STATUSES.Unavailable);
  });

  test('get all processed patients vale', async () => {
    const result = await resolutionController.getAllProcessedPatientsValue();
    expect(result.getValue).toEqual(['Tim']);
    expect(result.getStatus).toEqual(STATUSES.OK);
  });

  test('find patient resolution', async () => {
    const result = await resolutionController.findResolution('Tim');
    expect(result.getValue).toEqual('All good');
    expect(result.getStatus).toEqual(STATUSES.OK);
  });

  test('find not existed patient resolution', async () => {
    const result = await resolutionController.findResolution('Anton');
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(STATUSES.NotFound);
  });

  test('delete patient resolution', async () => {
    await resolutionController.deleteResolution('Tim');
    const result = await resolutionController.findResolution('Tim');
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(STATUSES.OK);
  });

  test('delete not existed patient resolution', async () => {
    const result = await resolutionController.deleteResolution('Anton');
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(STATUSES.NotFound);
  });
});
