import PatientService from '../api/service/PatientService.js';
import QueueService from '../api/service/QueueService.js';
import QueueController from '../api/controllers/queueController.js';
import { patientInMemoryStorage } from '../api/repositories/patientStorage.js';
import { resolutionInMemoryStorage } from '../api/repositories/resolutionStorage.js';
import { queueInMemoryStorage } from '../api/repositories/queueStorage.js';
import { NOT_AVAILABLE, STATUSES } from '../constants';

jest.mock('../api/service/QueueService.js');

describe('queue controller unit tests', () => {
  const patientsService = new PatientService(
    patientInMemoryStorage,
    resolutionInMemoryStorage,
  );
  const queueService = new QueueService(queueInMemoryStorage, patientsService);
  const queueController = new QueueController(queueService);

  test('check length', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await queueController.checkLength();
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.Unavailable);
  });

  test('check length', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    const res = await queueController.checkLength();
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('check is value exist', async () => {
    queueService.isExist.mockImplementation((body) => {
      expect(body).toEqual('Tim');
      return true;
    });
    const res = await queueController.checkIsExistValue('Tim');
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.BadRequest);
  });

  test('check is value exist', async () => {
    queueService.isExist.mockImplementation((body) => {
      expect(body).toEqual('Dima');
      return false;
    });
    const res = await queueController.checkIsExistValue('Dima');
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('add value in queue', async () => {
    queueService.isExist.mockImplementation((body) => {
      expect(body).toEqual('Andrei');
      return false;
    });
    queueService.push.mockImplementation((body) => {
      expect(body).toEqual('Andrei');
      return 'pushed';
    });
    const res = await queueController.addValueInQueue('Andrei');
    expect(res.getValue).toEqual('Added');
    expect(res.getStatus).toEqual(STATUSES.Created);
  });

  test('add existed value in queue', async () => {
    queueService.isExist.mockImplementation((body) => {
      expect(body).toEqual('Andrei');
      return true;
    });
    const res = await queueController.addValueInQueue('Andrei');
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.BadRequest);
  });

  test('get current value from queue', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    queueService.getCurrent.mockResolvedValue('Tim');
    const res = await queueController.getCurrentInQueue('Andrei');
    expect(res.getValue).toEqual('Tim');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('get current value from empty queue', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await queueController.getCurrentInQueue('Andrei');
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.Unavailable);
  });

  test('take next value from queue', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    queueService.pop.mockResolvedValue('shifted');
    const res = await queueController.takeNextValueInQueue();
    expect(res.getValue).toEqual('shifted');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('take next value from empty queue', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await queueController.takeNextValueInQueue();
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.Unavailable);
  });
});