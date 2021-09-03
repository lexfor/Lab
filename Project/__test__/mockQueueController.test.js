import PatientService from '../api/patient/patient.service/patientService.js';
import QueueService from '../api/queue/queue.service/queueService.js';
import QueueController from '../api/queue/queue.controller/queueController.js';
import PatientSQL from '../api/patient/patient.repository/patientSQL.js';
import ResolutionSQL from '../api/patient/patient.repository/resolutionSQL.js';
import QueueRedis from '../api/queue/queue.repository/queueRedis.js';
import { NOT_AVAILABLE, STATUSES } from '../constants';

jest.mock('../api/patient/patient.service/patientService.js');
jest.mock('../api/queue/queue.service/queueService.js');

describe('queue controller unit tests', () => {
  const patientRepository = new PatientSQL();
  const resolutionRepository = new ResolutionSQL();
  const queueRepository = new QueueRedis();

  const patientsService = new PatientService(
    patientRepository,
    resolutionRepository,
  );
  const queueService = new QueueService(queueRepository, patientsService);
  const queueController = new QueueController(queueService, patientsService);

  test('check length', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await queueController.checkLength();
    expect(res.getValue.name).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('check length', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    const res = await queueController.checkLength();
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
    expect(res.getValue.name).toEqual('Andrei');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('get current value from queue', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    queueService.getCurrent.mockResolvedValue({ name: 'Tim', id: '123' });
    const res = await queueController.getCurrentInQueue('Andrei');
    expect(res.getValue.name).toEqual('Tim');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('get current value from empty queue', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await queueController.getCurrentInQueue('Andrei');
    expect(res.getValue.name).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('take next value from queue', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    queueService.shift.mockResolvedValue({ id: 123, name: 'Tim' });
    const res = await queueController.takeNextValueInQueue();
    expect(res.getValue.name).toEqual('Tim');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('take next value from empty queue', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await queueController.takeNextValueInQueue();
    expect(res.getValue.name).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });
});
