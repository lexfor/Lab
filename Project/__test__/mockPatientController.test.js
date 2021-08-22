import PatientService from '../api/service/PatientService.js';
import QueueService from '../api/service/QueueService.js';
import PatientController from '../api/controllers/patientController.js';
import { patientInMemoryStorage } from '../api/repositories/patientStorage.js';
import { resolutionInMemoryStorage } from '../api/repositories/resolutionStorage.js';
import { queueInMemoryStorage } from '../api/repositories/queueStorage.js';
import { NOT_AVAILABLE, STATUSES } from '../constants';

jest.mock('../api/service/PatientService.js');
jest.mock('../api/service/QueueService.js');

describe('queue controller unit tests', () => {
  const patientsService = new PatientService(
    patientInMemoryStorage,
    resolutionInMemoryStorage,
  );
  const queueService = new QueueService(queueInMemoryStorage, patientsService);
  const patientController = new PatientController(queueService, patientsService);

  test('check length', async () => {
    patientsService.isEmpty.mockResolvedValue(true);
    const res = await patientController.checkLength();
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.Unavailable);
  });

  test('check length', async () => {
    patientsService.isEmpty.mockResolvedValue(false);
    const res = await patientController.checkLength();
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('check is exist patient', async () => {
    patientsService.isExist.mockImplementation((name) => {
      expect(name).toEqual('Tim');
      return true;
    });
    const res = await patientController.checkIsExistPatient('Tim');
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('check is exist patient', async () => {
    patientsService.isExist.mockImplementation((name) => {
      expect(name).toEqual('Gleb');
      return false;
    });
    const res = await patientController.checkIsExistPatient('Gleb');
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.NotFound);
  });

  test('check current patient', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    const res = await patientController.checkCurrentPatient();
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('check current patient', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await patientController.checkCurrentPatient();
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.Unavailable);
  });

  test('set resolution for current patient', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    queueService.getCurrent.mockResolvedValue('Labkov');
    patientsService.updateResolution.mockImplementation((name, resolution, timeDelay) => {
      expect(name).toEqual('Labkov');
      expect(resolution).toEqual('good');
      expect(timeDelay).toEqual(process.env.TTL_DELAY);
      return 'updated';
    });
    const res = await patientController.setResolutionForCurrentPatient({ value: 'good' });
    expect(res.getValue).toEqual('Accepted');
    expect(res.getStatus).toEqual(STATUSES.Accepted);
  });

  test('set resolution for current patient with empty queue', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await patientController.setResolutionForCurrentPatient({ value: 'good' });
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.Unavailable);
  });

  test('set resolution for current patient with ttl', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    queueService.getCurrent.mockResolvedValue('Labkov');
    patientsService.updateResolution.mockImplementation((name, resolution, timeDelay) => {
      expect(name).toEqual('Labkov');
      expect(resolution).toEqual('good');
      expect(timeDelay).toEqual(20000);
      return 'updated';
    });
    const res = await patientController.setResolutionForCurrentPatient({ value: 'good', delay: 20000 });
    expect(res.getValue).toEqual('Accepted');
    expect(res.getStatus).toEqual(STATUSES.Accepted);
  });

  test('get all patients names', async () => {
    patientsService.isEmpty.mockResolvedValue(false);
    patientsService.getAllValue.mockResolvedValue(['Tim', 'Dima']);
    const res = await patientController.getAllProcessedPatientsValue();
    expect(res.getValue).toEqual(['Tim', 'Dima']);
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('get all patients names without any patient', async () => {
    patientsService.isEmpty.mockResolvedValue(true);
    const res = await patientController.getAllProcessedPatientsValue();
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.Unavailable);
  });

  test('find patient resolution', async () => {
    patientsService.isExist.mockImplementation((name) => {
      expect(name).toEqual('Andrei');
      return true;
    });
    patientsService.getResolution.mockImplementation((name) => {
      expect(name).toEqual('Andrei');
      return 'All fine';
    });
    const res = await patientController.findResolution('Andrei');
    expect(res.getValue).toEqual('All fine');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('find patient resolution', async () => {
    patientsService.isExist.mockImplementation((name) => {
      expect(name).toEqual('Andrei');
      return false;
    });
    const res = await patientController.findResolution('Andrei');
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.NotFound);
  });

  test('delete patient resolution', async () => {
    patientsService.isExist.mockImplementation((name) => {
      expect(name).toEqual('Andrei');
      return true;
    });
    patientsService.deleteResolution.mockImplementation((name) => {
      expect(name).toEqual('Andrei');
      return 'deleted';
    });
    const res = await patientController.deleteResolution('Andrei');
    expect(res.getValue).toEqual('deleted');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('delete patient resolution', async () => {
    patientsService.isExist.mockImplementation((name) => {
      expect(name).toEqual('Andrei');
      return false;
    });
    const res = await patientController.deleteResolution('Andrei');
    expect(res.getValue).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.NotFound);
  });
});
