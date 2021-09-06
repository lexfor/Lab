import PatientService from '../api/patient/patient.service';
import QueueService from '../api/queue/queue.service';
import PatientController from '../api/patient/patient.controller';
import { NOT_AVAILABLE, STATUSES } from '../constants';

jest.mock('../api/patient/patient.service');
jest.mock('../api/queue/queue.service');

describe('patient controller unit tests', () => {
  const patientService = new PatientService();
  const queueService = new QueueService();
  const patientController = new PatientController(queueService, patientService);

  test('check patient, that not in queue', async () => {
    queueService.isExist.mockImplementation((value) => {
      expect(value).toEqual('1111');
      return false;
    });
    const res = await patientController.checkIsPatientInQueue('1111');
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('empty patient queue', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await patientController.checkLength();
    expect(res.getValue.name).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('not empty patient queue', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    const res = await patientController.checkLength();
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('add value in queue', async () => {
    patientService.findPatientByUser.mockImplementation((userID) => {
      expect(userID).toEqual('1111');
      return { id: '2222', name: 'Tim' };
    });
    queueService.isExist.mockImplementation((patientID) => {
      expect(patientID).toEqual('2222');
      return false;
    });
    queueService.push.mockImplementation((patientID) => {
      expect(patientID).toEqual('2222');
      return patientID;
    });
    const res = await patientController.addValueInQueue('1111');
    expect(res.getValue).toEqual('2222');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('get current value from queue', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    queueService.getCurrent.mockResolvedValue('1111');
    patientService.findPatientByID.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return { id: patientID, name: 'Tim' };
    });
    const res = await patientController.getCurrentInQueue();
    expect(res.getValue.name).toEqual('Tim');
    expect(res.getValue.id).toEqual('1111');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('get current value from empty queue', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await patientController.getCurrentInQueue();
    expect(res.getValue.name).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('take next value from queue', async () => {
    queueService.isEmpty.mockResolvedValue(false);
    queueService.shift.mockResolvedValue('1111');
    const res = await patientController.takeNextValueInQueue();
    expect(res.getValue).toEqual('1111');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('take next value from empty queue', async () => {
    queueService.isEmpty.mockResolvedValue(true);
    const res = await patientController.takeNextValueInQueue();
    expect(res.getValue.name).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });
});
