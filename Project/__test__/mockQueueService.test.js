import QueueService from '../api/service/QueueService.js';
import { queueInMemoryStorage } from '../api/repositories/queueStorage';
import PatientService from '../api/service/PatientService.js';

jest.mock('../api/repositories/queueStorage');
jest.mock('../api/service/PatientService.js');

describe('queue service unit tests', () => {
  const patients = new PatientService();
  const queue = new QueueService(
    queueInMemoryStorage,
    patients,
  );

  test('push patient in queue', async () => {
    patients.createPatient.mockImplementation((name) => {
      expect(name).toEqual('Tim');
      return '123';
    });
    queueInMemoryStorage.push.mockImplementation((id) => {
      expect(id).toEqual('123');
    });
    const result = await queue.push('Tim');
    expect(result).toEqual('pushed');
  });

  test('pop patient from queue', async () => {
    queueInMemoryStorage.shift.mockImplementation(() => 'shifted');
    const result = await queue.shift();
    expect(result).toEqual('shifted');
  });

  test('get current patient from queue', async () => {
    queueInMemoryStorage.getFirst.mockResolvedValue('123');
    patients.getPatientName.mockImplementation((id) => {
      expect(id).toEqual('123');
      return 'Tim';
    });
    const result = await queue.getCurrent();
    expect(result).toEqual('Tim');
  });

  test('check is exist patient', async () => {
    queueInMemoryStorage.getAll.mockImplementation(() => ['aaa', 'bbb', 'ccc']);
    patients.getPatientName.mockImplementation((item) => {
      switch (item) {
        case 'aaa':
          return 'Tim';
        case 'bbb':
          return 'Dima';
        case 'ccc':
          return 'Andrei';
        default:
          return 'N/A';
      }
    });
    const result = await queue.isExist('Tim');
    expect(result).toEqual(true);
  });

  test('check is exist patient', async () => {
    queueInMemoryStorage.getAll.mockImplementation(() => ['aaa', 'bbb', 'ccc']);
    patients.getPatientName.mockImplementation((item) => {
      switch (item) {
        case 'aaa':
          return 'Tim';
        case 'bbb':
          return 'Dima';
        case 'ccc':
          return 'Andrei';
        default:
          return 'N/A';
      }
    });
    const result = await queue.isExist('Anton');
    expect(result).toEqual(false);
  });

  test('check is patient storage empty', async () => {
    queueInMemoryStorage.getAll.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await queue.isEmpty();
    expect(result).toEqual(false);
  });

  test('check is patient storage empty', async () => {
    queueInMemoryStorage.getAll.mockImplementation(() => []);
    const result = await queue.isEmpty();
    expect(result).toEqual(true);
  });
});
