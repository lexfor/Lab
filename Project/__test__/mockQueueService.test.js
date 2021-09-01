import QueueService from '../api/service/QueueService.js';
import QueueRedis from '../api/repositories/queue.repositories/queueRedis.js';
import PatientSQL from '../api/repositories/patient.repositories/patientSQL.js';

jest.mock('../api/repositories/queue.repositories/queueRedis.js');
jest.mock('../api/repositories/patient.repositories/patientSQL.js');

describe('queue service unit tests', () => {
  const patientRepository = new PatientSQL();
  const queueRepository = new QueueRedis();
  const queue = new QueueService(
    queueRepository,
    patientRepository,
  );

  test('push patient in queue', async () => {
    queueRepository.push.mockImplementation((user) => {
      expect(user.id).toEqual('123');
      expect(user.name).toEqual('Tim');
      return { id: '123', value: 'good' };
    });
    const result = await queue.push({ name: 'Tim', id: '123' });
    expect(result).toEqual({ id: '123', value: 'good' });
  });

  test('pop patient from queue', async () => {
    queueRepository.shift.mockImplementation(() => 'shifted');
    const result = await queue.shift();
    expect(result).toEqual('shifted');
  });

  test('get current patient from queue', async () => {
    queueRepository.getFirst.mockResolvedValue('123');
    patientRepository.getByID.mockImplementation((id) => {
      expect(id).toEqual('123');
      return { name: 'Tim', id: '123' };
    });
    const result = await queue.getCurrent();
    expect(result).toEqual({ name: 'Tim', id: '123' });
  });

  test('check is exist patient', async () => {
    queueRepository.getAll.mockImplementation(() => ['aaa', 'bbb', 'ccc']);
    patientRepository.getByID.mockImplementation((item) => {
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
    queueRepository.getAll.mockImplementation(() => ['aaa', 'bbb', 'ccc']);
    patientRepository.getByID.mockImplementation((item) => {
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
    queueRepository.getAll.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await queue.isEmpty();
    expect(result).toEqual(false);
  });

  test('check is patient storage empty', async () => {
    queueRepository.getAll.mockImplementation(() => []);
    const result = await queue.isEmpty();
    expect(result).toEqual(true);
  });
});
