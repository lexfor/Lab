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
    queueRepository.push.mockImplementation((userID, name, type) => {
      expect(userID).toEqual('123');
      expect(name).toEqual('Oleg');
      expect(type).toEqual('surgeon');
      return { id: '123' };
    });
    const result = await queue.push('123', 'Oleg', 'surgeon');
    expect(result.id).toEqual('123');
  });

  test('shift patient from queue', async () => {
    queueRepository.shift.mockImplementation((name, type) => {
      expect(name).toEqual('Oleg');
      expect(type).toEqual('surgeon');
      return '1111';
    });
    const result = await queue.shift('Oleg', 'surgeon');
    expect(result).toEqual('1111');
  });

  test('get current patient from queue', async () => {
    queueRepository.getFirst.mockImplementation((name, type) => {
      expect(name).toEqual('Oleg');
      expect(type).toEqual('surgeon');
      return '1111';
    });
    const result = await queue.getCurrent('Oleg', 'surgeon');
    expect(result).toEqual('1111');
  });
});
