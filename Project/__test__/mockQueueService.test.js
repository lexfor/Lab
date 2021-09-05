import QueueService from '../api/queue/queue.service';
import QueueRepository from '../api/queue/queue.repository';
import PatientRepository from '../api/patient/patient.repository';

jest.mock('../api/queue/queue.repository/index.js');
jest.mock('../api/patient/patient.repository/index.js');

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

  test('pop patient from queue', async () => {
    queueRepository.shift.mockResolvedValue('1111');
    const result = await queue.shift();
    expect(result).toEqual('1111');
  });

  test('get current patient from queue', async () => {
    queueRepository.getFirst.mockResolvedValue('1111');
    const result = await queue.getCurrent();
    expect(result).toEqual('1111');
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
