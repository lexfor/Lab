import { ResolutionService, ResolutionController } from '../api/resolutions';
import { QueueService } from '../api/queue';
import { PatientService } from '../api/patient';
import { STATUSES } from '../constants';
import ApiError from '../api/helpers/ApiError';
import doctor from "../routes/doctor";

jest.mock('../api/resolutions/service/resolution.service');
jest.mock('../api/queue/service/queue.service');
jest.mock('../api/patient/service/patient.service');

describe('resolution controller unit tests', () => {
  const patientsService = new PatientService();
  const resolutionService = new ResolutionService();
  const queueService = new QueueService();
  const resolutionController = new ResolutionController(
    resolutionService,
    queueService,
    patientsService,
  );

  test('resolution added', async () => {
    queueService.isEmpty.mockImplementation((name, specialization) => {
      expect(name).toEqual('Oleg');
      expect(specialization).toEqual('surgeon');
      return false;
    });
    resolutionService.addResolution.mockImplementation((data) => {
      expect(data.value).toEqual('good');
      expect(data.patient_id).toEqual('1111');
      expect(data.delay).toEqual(process.env.TTL_DELAY);
      expect(data.doctor_name).toEqual('Oleg');
      expect(data.doctor_specialization).toEqual('surgeon');
      return { value: data.value, id: '123' };
    });
    const res = await resolutionController.setResolution(
      { value: 'good' },
      { id: '1111' },
      { firstName: 'Oleg', specializationName: 'surgeon' },
    );
    expect(res.getValue.value).toEqual('good');
    expect(res.getValue.id).toEqual('123');
    expect(res.getStatus).toEqual(STATUSES.CREATED);
  });

  test('cant set resolution with no patients in queue', async () => {
    queueService.isEmpty.mockImplementation((name, specialization) => {
      expect(name).toEqual('Oleg');
      expect(specialization).toEqual('surgeon');
      throw new ApiError('empty', STATUSES.CONFLICT);
    });
    const res = await resolutionController.setResolution(
      { value: 'good' },
      { id: '1111' },
      { firstName: 'Oleg', specializationName: 'surgeon' },
    );
    expect(res.getStatus).toEqual(STATUSES.CONFLICT);
  });

  test('added resolution with custom ttl', async () => {
    queueService.isEmpty.mockImplementation((name, specialization) => {
      expect(name).toEqual('Oleg');
      expect(specialization).toEqual('surgeon');
      return false;
    });
    resolutionService.addResolution.mockImplementation((data) => {
      expect(data.value).toEqual('good');
      expect(data.patient_id).toEqual('1111');
      expect(data.delay).toEqual(20000);
      expect(data.doctor_name).toEqual('Oleg');
      expect(data.doctor_specialization).toEqual('surgeon');
      return { value: data.value, id: '123' };
    });
    const res = await resolutionController.setResolution(
      { value: 'good' },
      { id: '1111' },
      { firstName: 'Oleg', specializationName: 'surgeon' },
      20000,
    );
    expect(res.getValue.value).toEqual('good');
    expect(res.getStatus).toEqual(STATUSES.CREATED);
  });

  test('found patient resolution by id', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.userID).toEqual('1111');
      return true;
    });
    patientsService.findPatient.mockImplementation((patient) => {
      expect(patient.userID).toEqual('1111');
      return '2222';
    });
    resolutionService.getResolution.mockImplementation((patientID) => {
      expect(patientID).toEqual('2222');
      return { value: 'good' };
    });
    const res = await resolutionController.findResolution({ userID: '1111' });
    expect(res.getValue.value).toEqual('good');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('deleted patient resolution', async () => {
    patientsService.isExist.mockImplementation((patient) => {
      expect(patient.id).toEqual('1111');
    });
    resolutionService.isExist.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
    });
    resolutionService.deleteResolution.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return { id: '2222', value: 'bad' };
    });
    const res = await resolutionController.deletePatientResolution({ id: '1111' });
    expect(res.getValue.value).toEqual('bad');
    expect(res.getValue.id).toEqual('2222');
    expect(res.getStatus).toEqual(STATUSES.ACCEPTED);
  });

  test('deleted patient resolution', async () => {
    resolutionService.deleteResolution.mockImplementation((id) => {
      expect(id).toEqual('1111');
    });
    const res = await resolutionController.deletePatientResolution({ id: '1111' });
    expect(res.getStatus).toEqual(STATUSES.ACCEPTED);
  });
});
