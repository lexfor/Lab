import QueueService from '../api/service/QueueService.js';
import { queueMemoryRepository } from '../api/repositories/queue.repositories/queueMemory';
import PatientService from '../api/service/PatientService.js';

jest.mock('../api/repositories/queue.repositories/queueMemory');
jest.mock('../api/service/PatientService.js');

describe('queue service unit tests', () => {
  const patients = new PatientService();
  const queue = new QueueService(
    queueMemoryRepository,
    patients,
  );

  test('push patient in queue', async () => {
    patients.createPatient.mockImplementation((name) => {
      expect(name).toEqual('Tim');
      return '123';
    });
    queueMemoryRepository.push.mockImplementation((id) => {
      expect(id).toEqual('123');
    });
    const result = await queue.push('Tim');
    expect(result).toEqual('pushed');
  });

  test('pop patient from queue', async () => {
    queueMemoryRepository.shift.mockImplementation(() => 'shifted');
    const result = await queue.shift();
    expect(result).toEqual('shifted');
  });

  test('get current patient from queue', async () => {
    queueMemoryRepository.getFirst.mockResolvedValue('123');
    patients.getPatient.mockImplementation((id) => {
      expect(id).toEqual('123');
      return { name: 'Tim', id: '123' };
    });
    const result = await queue.getCurrent();
    expect(result).toEqual('Tim');
  });

  test('check is exist patient', async () => {
    queueMemoryRepository.getAll.mockImplementation(() => ['aaa', 'bbb', 'ccc']);
    patients.getPatient.mockImplementation((item) => {
      switch (item) {
        case 'aaa':
          return { name: 'Tim', id: 'aaa' };
        case 'bbb':
          return { name: 'Dima', id: 'bbb' };
        case 'ccc':
          return { name: 'Andrei', id: 'ccc' };
        default:
          return 'N/A';
      }
    });
    const result = await queue.isExist('Tim');
    expect(result).toEqual(true);
  });

  test('check is exist patient', async () => {
    queueMemoryRepository.getAll.mockImplementation(() => ['aaa', 'bbb', 'ccc']);
    patients.getPatient.mockImplementation((item) => {
      switch (item) {
        case 'aaa':
          return { name: 'Tim', id: 'aaa' };
        case 'bbb':
          return { name: 'Dima', id: 'bbb' };
        case 'ccc':
          return { name: 'Andrei', id: 'ccc' };
        default:
          return 'N/A';
      }
    });
    const result = await queue.isExist('Anton');
    expect(result).toEqual(false);
  });

  test('check is patient storage empty', async () => {
    queueMemoryRepository.getAll.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await queue.isEmpty();
    expect(result).toEqual(false);
  });

  test('check is patient storage empty', async () => {
    queueMemoryRepository.getAll.mockImplementation(() => []);
    const result = await queue.isEmpty();
    expect(result).toEqual(true);
  });
});
