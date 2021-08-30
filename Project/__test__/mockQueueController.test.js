import PatientService from '../api/service/PatientService.js';
import QueueService from '../api/service/QueueService.js';
import QueueController from '../api/controllers/queueController.js';
import { patientMemoryRepository } from '../api/repositories/patient.repositories/patientMemory.js';
import { resolutionMemoryRepository } from '../api/repositories/resolution.repositories/resolutionMemory.js';
import { queueMemoryRepository } from '../api/repositories/queue.repositories/queueMemory.js';
import { NOT_AVAILABLE, STATUSES } from '../constants';

jest.mock('../api/service/PatientService.js');
jest.mock('../api/service/QueueService.js');

describe('queue controller unit tests', () => {
  const patientsService = new PatientService(
    patientMemoryRepository,
    resolutionMemoryRepository,
  );
  const queueService = new QueueService(queueMemoryRepository, patientsService);
  const queueController = new QueueController(queueService, patientsService);

  test('check length', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await queueController.checkLength();
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('check length', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    const res = await queueController.checkLength();
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('check is value exist', async () => {
    patientsService.isExist.mockImplementation((body) => {
      expect(body).toEqual('Tim');
      return true;
    });
    const res = await queueController.checkIsExistPatient('Tim');
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.BAD_REQUEST);
  });

  test('check is value exist', async () => {
    patientsService.isExist.mockImplementation((body) => {
      expect(body).toEqual('Dima');
      return false;
    });
    const res = await queueController.checkIsExistPatient('Dima');
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('add value in queue', async () => {
    patientsService.isExist.mockImplementation((body) => {
      expect(body).toEqual('Andrei');
      return false;
    });
    queueService.push.mockImplementation((body) => {
      expect(body).toEqual('Andrei');
      return { name: 'Andrei', id: '123' };
    });
    const res = await queueController.addValueInQueue('Andrei');
    expect(res.getValue).toEqual('Andrei');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('add existed value in queue', async () => {
    patientsService.isExist.mockImplementation((body) => {
      expect(body).toEqual('Andrei');
      return true;
    });
    const res = await queueController.addValueInQueue('Andrei');
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.BAD_REQUEST);
  });

  test('get current value from queue', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    queueService.getCurrent.mockResolvedValue({ name: 'Tim', id: '123' });
    const res = await queueController.getCurrentInQueue('Andrei');
    expect(res.getValue).toEqual('Tim');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('get current value from empty queue', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await queueController.getCurrentInQueue('Andrei');
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('take next value from queue', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    queueService.shift.mockResolvedValue({ id: 123, name: 'Tim' });
    const res = await queueController.takeNextValueInQueue();
    expect(res.getValue).toEqual(123);
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('take next value from empty queue', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await queueController.takeNextValueInQueue();
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });
});
