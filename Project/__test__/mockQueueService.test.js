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
    queueRepository.push.mockImplementation((userID, doctorID) => {
      expect(userID).toEqual('1111');
      expect(doctorID).toEqual('2222');
      return { id: '123' };
    });
    const result = await queue.push('1111', '2222');
    expect(result.id).toEqual('123');
  });

  test('shift patient from queue', async () => {
    queueRepository.shift.mockImplementation((doctorID) => {
      expect(doctorID).toEqual('1111');
      return '2222';
    });
    const result = await queue.shift('1111');
    expect(result).toEqual('2222');
  });

  test('get current patient from queue', async () => {
    queueRepository.getFirst.mockImplementation((doctorID) => {
      expect(doctorID).toEqual('1111');
      return '2222';
    });
    const result = await queue.getCurrent('1111');
    expect(result).toEqual('2222');
  });
});
