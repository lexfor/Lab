import { PatientService } from '../api/patient';
import { QueueService, QueueController } from '../api/queue';
import { STATUSES } from '../constants';
import { DoctorService } from '../api/doctor';

jest.mock('../api/patient/service/patient.service');
jest.mock('../api/queue/service/queue.service');
jest.mock('../api/doctor/service/doctor.service');

describe('queue controller unit tests', () => {
  const patientService = new PatientService();
  const queueService = new QueueService();
  const doctorService = new DoctorService();
  const queueController = new QueueController(queueService, patientService, doctorService);

  test('add value in queue', async () => {
    patientService.findPatientByUser.mockImplementation((userID) => {
      expect(userID).toEqual('1111');
      return { id: '3333', name: 'Tim' };
    });
    queueService.isExist.mockImplementation((patientID, doctorID) => {
      expect(patientID).toEqual('3333');
      expect(doctorID).toEqual('2222');
    });
    queueService.push.mockImplementation((patientID, doctorID) => {
      expect(patientID).toEqual('3333');
      expect(doctorID).toEqual('2222');
      return patientID;
    });
    const res = await queueController.addValueInQueue('1111', '2222');
    expect(res.getValue).toEqual('3333');
    expect(res.getStatus).toEqual(STATUSES.ACCEPTED);
  });

  test('get current value from queue', async () => {
    queueService.isEmpty.mockImplementation((id) => {
      expect(id).toEqual('1111');
    });
    queueService.getCurrent.mockImplementation((id) => {
      expect(id).toEqual('1111');
      return '2222';
    });
    patientService.findPatientByID.mockImplementation((patientID) => {
      expect(patientID).toEqual('2222');
      return { id: patientID, name: 'Tim' };
    });
    const res = await queueController.getCurrentInQueue('1111');
    expect(res.getValue.name).toEqual('Tim');
    expect(res.getValue.id).toEqual('2222');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('take next value from queue', async () => {
    doctorService.getDoctorByID.mockImplementation((id) => {
      expect(id).toEqual('1111');
      return { doctor_id: '2222', name: 'Tim' };
    });
    queueService.isEmpty.mockImplementation((id) => {
      expect(id).toEqual('2222');
    });
    queueService.shift.mockImplementation((id) => {
      expect(id).toEqual('2222');
      return '3333';
    });
    const res = await queueController.takeNextValueInQueue('1111');
    expect(res.getValue).toEqual('3333');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('get current from doctor queue', async () => {
    doctorService.getDoctorByID.mockImplementation((id) => {
      expect(id).toEqual('1111');
      return { doctor_id: '2222', name: 'Tim' };
    });
    queueService.isEmpty.mockImplementation((id) => {
      expect(id).toEqual('2222');
    });
    queueService.getCurrent.mockImplementation((id) => {
      expect(id).toEqual('2222');
      return '3333';
    });
    patientService.findPatientByID.mockImplementation((patientID) => {
      expect(patientID).toEqual('3333');
      return { id: patientID, name: 'Tim' };
    });
    const res = await queueController.getCurrentInMyQueue('1111');
    expect(res.getValue.name).toEqual('Tim');
    expect(res.getValue.id).toEqual('3333');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });
});
