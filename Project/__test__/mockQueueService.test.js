import QueueService from '../api/queue/queue.service/queueService.js';
import QueueRedis from '../api/queue/queue.repository/queueRedis.js';
import PatientSQL from '../api/patient/patient.repository/patientSQL.js';

jest.mock('../api/queue/queue.repository/queueRedis.js');
jest.mock('../api/patient/patient.repository/patientSQL.js');

describe('queue service unit tests', () => {
  const patientRepository = new PatientSQL();
  const queueRepository = new QueueRedis();
  const queue = new QueueService(
    queueRepository,
    patientRepository,
  );

  test('push patient in queue', async () => {
    queueRepository.push.mockImplementation((userID) => {
      expect(userID).toEqual('123');
      return { id: '123', value: 'good' };
    });
    const result = await queue.push('123');
    expect(result).toEqual({ id: '123', value: 'good' });
  });

  test('pop patient from queue', async () => {
    queueRepository.shift.mockImplementation(() => 'shifted');
    const result = await queue.shift();
    expect(result).toEqual('shifted');
  });

  test('get current patient from queue', async () => {
    queueRepository.getFirst.mockResolvedValue('123');
    const result = await queue.getCurrent();
    expect(result).toEqual('123');
  });

  test('check is exist patient', async () => {
    queueRepository.getAll.mockImplementation(() => ['aaa', 'bbb', 'ccc']);
    const result = await queue.isExist('aaa');
    expect(result).toEqual(true);
  });

  test('check is exist patient', async () => {
    queueRepository.getAll.mockImplementation(() => ['aaa', 'bbb', 'ccc']);
    const result = await queue.isExist('fff');
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
