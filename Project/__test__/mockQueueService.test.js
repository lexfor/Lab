import { QueueService, QueueRepository } from '../api/queue';
import { PatientRepository } from '../api/patient';

jest.mock('../api/queue/repository/queue.repository');
jest.mock('../api/patient/repository/patient.repository.js');

describe('queue service unit tests', () => {
  const patientRepository = new PatientRepository();
  const queueRepository = new QueueRepository();
  const queue = new QueueService(
    queueRepository,
    patientRepository,
  );

  test('push patient in queue', async () => {
    queueRepository.push.mockImplementation((userID) => {
      expect(userID).toEqual('123');
      return { id: '123' };
    });
    const result = await queue.push('123');
    expect(result.id).toEqual('123');
  });

  test('shift patient from queue', async () => {
    queueRepository.shift.mockResolvedValue('1111');
    const result = await queue.shift();
    expect(result).toEqual('1111');
  });

  test('get current patient from queue', async () => {
    queueRepository.getFirst.mockResolvedValue('1111');
    const result = await queue.getCurrent();
    expect(result).toEqual('1111');
  });

  test('patient in queue', async () => {
    queueRepository.getAll.mockImplementation(() => ['aaa', 'bbb', 'ccc']);
    const result = await queue.isExist('aaa');
    expect(result).toEqual(true);
  });

  test('no that patient in queue', async () => {
    queueRepository.getAll.mockImplementation(() => ['aaa', 'bbb', 'ccc']);
    const result = await queue.isExist('fff');
    expect(result).toEqual(false);
  });

  test('queue not empty', async () => {
    queueRepository.getAll.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await queue.isEmpty();
    expect(result).toEqual(false);
  });

  test('queue empty', async () => {
    queueRepository.getAll.mockImplementation(() => []);
    const result = await queue.isEmpty();
    expect(result).toEqual(true);
  });
});
