import PatientService from '../api/patient/patient.service/patientService.js';
import QueueService from '../api/queue/queue.service/queueService.js';
import PatientController from '../api/patient/patient.controller/patientController.js';
import PatientSQL from '../api/patient/patient.repository/patientSQL.js';
import ResolutionSQL from '../api/patient/patient.repository/resolutionSQL.js';
import QueueRedis from '../api/queue/queue.repository/queueRedis.js';
import { NOT_AVAILABLE, STATUSES } from '../constants';

jest.mock('../api/patient/patient.service/patientService.js');
jest.mock('../api/queue/queue.service/queueService.js');

describe('patient controller unit tests', () => {
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
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.name).toEqual('Tim');
      return true;
    });
    const res = await patientController.checkIsExistPatient({ name: 'Tim' });
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('check is exist patient', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.name).toEqual('Tim');
      return false;
    });
    const res = await patientController.checkIsExistPatient({ name: 'Tim' });
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
    patientsService.addPatientResolution.mockImplementation((resolution, patientID, timeDelay) => {
      expect(resolution).toEqual('good');
      expect(patientID).toEqual('1111');
      expect(timeDelay).toEqual(process.env.TTL_DELAY);
      return { value: resolution, id: '123' };
    });
    const res = await patientController.setResolution('good', '1111');
    expect(res.getValue.value).toEqual('good');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('set resolution for current patient with empty queue', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await patientController.setResolution('good', '1111');
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('set resolution for current patient with ttl', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    patientsService.addPatientResolution.mockImplementation((resolution, patientID, timeDelay) => {
      expect(resolution).toEqual('good');
      expect(patientID).toEqual('1111');
      expect(timeDelay).toEqual(20000);
      return { value: 'good' };
    });
    const res = await patientController.setResolution('good', '1111', 20000);
    expect(res.getValue.value).toEqual('good');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('find patient resolution by name', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.name).toEqual('Andrei');
      return true;
    });
    patientsService.findPatientResolution.mockImplementation((patient) => {
      expect(patient.name).toEqual('Andrei');
      return { value: 'All fine' };
    });
    const res = await patientController.findResolution({ name: 'Andrei' });
    expect(res.getValue.value).toEqual('All fine');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('find patient resolution by id', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.id).toEqual('1111');
      return true;
    });
    patientsService.findPatientResolution.mockImplementation((patient) => {
      expect(patient.id).toEqual('1111');
      return { value: 'All fine' };
    });
    const res = await patientController.findResolution({ id: '1111' });
    expect(res.getValue.value).toEqual('All fine');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('find patient resolution', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.name).toEqual('Andrei');
      return false;
    });
    const res = await patientController.findResolution({ name: 'Andrei' });
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.NOT_FOUND);
  });

  test('delete patient resolution', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.id).toEqual('1111');
      return true;
    });
    patientsService.deletePatientResolution.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return { id: '2222', value: 'bad' };
    });
    const res = await patientController.deletePatientResolution('1111');
    expect(res.getValue.value).toEqual('bad');
    expect(res.getValue.id).toEqual('2222');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('delete patient resolution', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.id).toEqual('1111');
      return false;
    });
    const res = await patientController.deletePatientResolution('1111');
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.NOT_FOUND);
  });
});
