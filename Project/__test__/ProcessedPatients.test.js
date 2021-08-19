import PatientsResolutionsService from '../api/service/PatientsResolutionsService.js';
import { resolutionInMemoryStorage } from '../api/repositories/resolutionStorage.js';
import { resolutionInRedisStorage } from '../api/repositories/resolutionRedis.js';
import { envConfig } from '../config.js';

let resolutionStorage;

switch (envConfig.storage.name) {
  case 'redis':
    resolutionStorage = resolutionInRedisStorage;
    break;
  default:
    resolutionStorage = resolutionInMemoryStorage;
}

describe('patient service', () => {
  const patients = new PatientsResolutionsService(resolutionStorage);
  test('Create patient resolution', async () => {
    const result = await patients.createResolution('Timofei');
    expect(result).toEqual('pushed');
  });

  test('Update patient resolution', async () => {
    const result = await patients.updateResolution('Timofei', 'All fine');
    expect(result).toEqual('updated');
  });

  test('get patient resolution', async () => {
    const result = await patients.getResolution('Timofei');
    expect(result).toEqual('All fine');
  });

  test('get not existed patient resolution', async () => {
    const result = await patients.getResolution('Andrei');
    expect(result).toEqual('not found');
  });

  test('get all patients resolution', async () => {
    const result = await patients.getAllValue();
    expect(result).toEqual(['Timofei']);
  });

  test('delete patient resolution', async () => {
    const result = await patients.deleteResolution('Timofei');
    expect(result).toEqual('deleted');
  });

  test('delete not existed patient resolution', async () => {
    const result = await patients.deleteResolution('Andrei');
    expect(result).toEqual('not found');
  });

  test('get deleted patient resolution', async () => {
    const result = await patients.getResolution('Timofei');
    expect(result).toEqual('N/A');
  });
});
