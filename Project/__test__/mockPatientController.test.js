import { PatientService, PatientController } from '../api/patient';
import { QueueService } from '../api/queue';
import { STATUSES } from '../constants';

jest.mock('../api/patient/service/patient.service');
jest.mock('../api/queue/service/queue.service');

describe('patient controller unit tests', () => {
  const patientService = new PatientService();
  const queueService = new QueueService();
  const patientController = new PatientController(queueService, patientService);

  test('add value in queue', async () => {
    patientService.findPatientByUser.mockImplementation((userID) => {
      expect(userID).toEqual('1111');
      return { id: '2222', name: 'Tim' };
    });
    queueService.isExist.mockImplementation((patientID, doctorName, doctorType) => {
      expect(patientID).toEqual('2222');
      expect(doctorName).toEqual('Oleg');
      expect(doctorType).toEqual('surgeon');
    });
    queueService.push.mockImplementation((patientID, doctorName, doctorType) => {
      expect(patientID).toEqual('2222');
      expect(doctorName).toEqual('Oleg');
      expect(doctorType).toEqual('surgeon');
      return patientID;
    });
    const res = await patientController.addValueInQueue('1111', 'Oleg', 'surgeon');
    expect(res.getValue).toEqual('2222');
    expect(res.getStatus).toEqual(STATUSES.ACCEPTED);
  });

  test('get current value from queue', async () => {
    queueService.isEmpty.mockImplementation((name, type) => {
      expect(name).toEqual('Oleg');
      expect(type).toEqual('surgeon');
    });
    queueService.getCurrent.mockImplementation((name, type) => {
      expect(name).toEqual('Oleg');
      expect(type).toEqual('surgeon');
      return '1111';
    });
    patientService.findPatientByID.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return { id: patientID, name: 'Tim' };
    });
    const res = await patientController.getCurrentInQueue('Oleg', 'surgeon');
    expect(res.getValue.name).toEqual('Tim');
    expect(res.getValue.id).toEqual('1111');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('take next value from queue', async () => {
    queueService.isEmpty.mockImplementation((name, type) => {
      expect(name).toEqual('Oleg');
      expect(type).toEqual('surgeon');
    });
    queueService.shift.mockImplementation((name, type) => {
      expect(name).toEqual('Oleg');
      expect(type).toEqual('surgeon');
      return '1111';
    });
    const res = await patientController.takeNextValueInQueue('Oleg', 'surgeon');
    expect(res.getValue).toEqual('1111');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('take next value from queue', async () => {
    patientService.getAllPatientWithCondition.mockImplementation((patientInfo) => {
      expect(patientInfo).toEqual('Tim');
      return { id: '1111', name: 'Tim' };
    });
    const res = await patientController.findAllPatientsWithCondition({ patientInfo: 'Tim' });
    expect(res.getValue.id).toEqual('1111');
    expect(res.getValue.name).toEqual('Tim');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });
});
