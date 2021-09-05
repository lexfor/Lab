import ResolutionService from '../api/resolutions/resolution.service';
import QueueService from '../api/queue/queue.service';
import PatientService from '../api/patient/patient.service';
import ResolutionController from '../api/resolutions/resolution.controller';
import { NOT_AVAILABLE, STATUSES } from '../constants';

jest.mock('../api/resolutions/resolution.service');
jest.mock('../api/queue/queue.service');
jest.mock('../api/patient/patient.service');

describe('resolution controller unit tests', () => {
  const patientsService = new PatientService();
  const resolutionService = new ResolutionService();
  const queueService = new QueueService();
  const resolutionController = new ResolutionController(
    resolutionService,
    queueService,
    patientsService,
  );

  test('check is exist patient', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.name).toEqual('Tim');
      return true;
    });
    const res = await resolutionController.checkIsExistPatient({ name: 'Tim' });
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('check is exist patient', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.user_id).toEqual('1111');
      return true;
    });
    const res = await resolutionController.checkIsExistPatient({ user_id: '1111' });
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('check is exist patient', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.name).toEqual('Tim');
      return false;
    });
    const res = await resolutionController.checkIsExistPatient({ name: 'Tim' });
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.NOT_FOUND);
  });

  test('check current patient', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    const res = await resolutionController.checkCurrentPatient();
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('check current patient', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await resolutionController.checkCurrentPatient();
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('set resolution for current patient', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    resolutionService.addResolution.mockImplementation((resolution, patientID, timeDelay) => {
      expect(resolution).toEqual('good');
      expect(patientID).toEqual('1111');
      expect(timeDelay).toEqual(process.env.TTL_DELAY);
      return { value: resolution, id: '123' };
    });
    const res = await resolutionController.setResolution('good', '1111');
    expect(res.getValue.value).toEqual('good');
    expect(res.getValue.id).toEqual('123');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('set resolution for current patient with empty queue', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await resolutionController.setResolution('good', '1111');
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('set resolution for current patient with ttl', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    resolutionService.addResolution.mockImplementation((resolution, patientID, timeDelay) => {
      expect(resolution).toEqual('good');
      expect(patientID).toEqual('1111');
      expect(timeDelay).toEqual(20000);
      return { value: 'good' };
    });
    const res = await resolutionController.setResolution('good', '1111', 20000);
    expect(res.getValue.value).toEqual('good');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('find patient resolution by name', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.name).toEqual('Andrei');
      return true;
    });
    patientsService.findPatient.mockImplementation((patient) => {
      expect(patient.name).toEqual('Andrei');
      return '1111';
    });
    resolutionService.getResolution.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return { value: 'good' };
    });
    const res = await resolutionController.findResolution({ name: 'Andrei' });
    expect(res.getValue.value).toEqual('good');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('find patient resolution by id', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.user_id).toEqual('1111');
      return true;
    });
    patientsService.findPatient.mockImplementation((patient) => {
      expect(patient.user_id).toEqual('1111');
      return '2222';
    });
    resolutionService.getResolution.mockImplementation((patientID) => {
      expect(patientID).toEqual('2222');
      return { value: 'good' };
    });
    const res = await resolutionController.findResolution({ user_id: '1111' });
    expect(res.getValue.value).toEqual('good');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('find patient resolution', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.name).toEqual('Andrei');
      return false;
    });
    const res = await resolutionController.findResolution({ name: 'Andrei' });
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.NOT_FOUND);
  });

  test('delete patient resolution', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.id).toEqual('1111');
      return true;
    });
    resolutionService.deleteResolution.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return { id: '2222', value: 'bad' };
    });
    const res = await resolutionController.deletePatientResolution('1111');
    expect(res.getValue.value).toEqual('bad');
    expect(res.getValue.id).toEqual('2222');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('delete patient resolution', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.id).toEqual('1111');
      return false;
    });
    const res = await resolutionController.deletePatientResolution('1111');
    expect(res.getValue.value).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.NOT_FOUND);
  });
});
