import PatientService from '../api/service/PatientService.js';
import QueueService from '../api/service/QueueService.js';
import PatientController from '../api/controllers/patientController.js';
import PatientSQL from '../api/repositories/patient.repositories/patientSQL.js';
import ResolutionSQL from '../api/repositories/resolution.repositories/resolutionSQL.js';
import QueueRedis from '../api/repositories/queue.repositories/queueRedis.js';
import { NOT_AVAILABLE, STATUSES } from '../constants';

jest.mock('../api/service/PatientService.js');
jest.mock('../api/service/QueueService.js');

describe('queue controller unit tests', () => {
  const patientRepository = new PatientSQL();
  const resolutionRepository = new ResolutionSQL();
  const queueRepository = new QueueRedis();
  const patientsService = new PatientService(
    patientRepository,
    resolutionRepository,
    queueRepository,
  );
  const queueService = new QueueService(queueRepository, patientsService);
  const patientController = new PatientController(queueService, patientsService);

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
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.NOT_FOUND);
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
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('set resolution for current patient', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    patientsService.addPatientResolution.mockImplementation((resolution, timeDelay) => {
      expect(resolution).toEqual('good');
      expect(timeDelay).toEqual(process.env.TTL_DELAY);
      return { value: resolution, id: '123' };
    });
    const res = await patientController.setResolutionForCurrentPatient('good');
    expect(res.getValue.value).toEqual('good');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('set resolution for current patient with empty queue', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await patientController.setResolutionForCurrentPatient({ value: 'good' });
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('set resolution for current patient with ttl', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    patientsService.addPatientResolution.mockImplementation((resolution, timeDelay) => {
      expect(resolution).toEqual('good');
      expect(timeDelay).toEqual(20000);
      return { value: 'good' };
    });
    const res = await patientController.setResolutionForCurrentPatient('good', 20000);
    expect(res.getValue.value).toEqual('good');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('find patient resolution', async () => {
    patientsService.isExist.mockImplementation((name) => {
      expect(name).toEqual('Andrei');
      return true;
    });
    patientsService.findPatientResolution.mockImplementation((name) => {
      expect(name).toEqual('Andrei');
      return { value: 'All fine' };
    });
    const res = await patientController.findResolutionByPatientName('Andrei');
    expect(res.getValue.value).toEqual('All fine');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('find patient resolution', async () => {
    patientsService.isExist.mockImplementation((name) => {
      expect(name).toEqual('Andrei');
      return false;
    });
    const res = await patientController.findResolutionByPatientName('Andrei');
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.NOT_FOUND);
  });

  test('delete patient resolution', async () => {
    queueService.isExist.mockImplementation((name) => {
      expect(name).toEqual('Andrei');
      return true;
    });
    const res = await patientController.deletePatientResolution('Andrei');
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.NOT_FOUND);
  });

  test('delete patient resolution', async () => {
    patientsService.isExist.mockImplementation((name) => {
      expect(name).toEqual('Andrei');
      return false;
    });
    const res = await patientController.deletePatientResolution('Andrei');
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.NOT_FOUND);
  });
});
