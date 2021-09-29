import { ResolutionService, ResolutionController } from '../index';
import { QueueService } from '../../queue';
import { PatientService } from '../../patient';
import { STATUSES } from '../../../constants';
import ApiError from '../../helpers/ApiError';
import { DoctorService } from '../../doctor';

jest.mock('../service/resolution.service');
jest.mock('../../queue/service/queue.service');
jest.mock('../../patient/service/patient.service');
jest.mock('../../doctor/service/doctor.service');

describe('resolution controller unit tests', () => {
  const patientsService = new PatientService();
  const resolutionService = new ResolutionService();
  const queueService = new QueueService();
  const doctorService = new DoctorService();
  const resolutionController = new ResolutionController(
    resolutionService,
    queueService,
    patientsService,
    doctorService,
  );

  test('resolution added', async () => {
    doctorService.getDoctorByID.mockImplementation((userID) => {
      expect(userID).toEqual('2222');
      return { first_name: 'Oleg', name: 'surgeon', doctor_id: '3333' };
    });
    queueService.isEmpty.mockImplementation((id) => {
      expect(id).toEqual('3333');
    });
    resolutionService.addResolution.mockImplementation((data) => {
      expect(data.value).toEqual('good');
      expect(data.patient_id).toEqual('1111');
      expect(data.delay).toEqual(process.env.TTL_DELAY);
      expect(data.doctor_name).toEqual('Oleg');
      expect(data.doctor_specialization).toEqual('surgeon');
      return { value: data.value, id: '123' };
    });
    const res = await resolutionController.addResolution(
      { value: 'good' },
      { id: '1111' },
      '2222',
    );
    expect(res.getValue.value).toEqual('good');
    expect(res.getValue.id).toEqual('123');
    expect(res.getStatus).toEqual(STATUSES.CREATED);
  });

  test('cant set resolution with no patients in queue', async () => {
    doctorService.getDoctorByID.mockImplementation((userID) => {
      expect(userID).toEqual('2222');
      return { first_name: 'Oleg', name: 'surgeon', doctor_id: '3333' };
    });
    queueService.isEmpty.mockImplementation((id) => {
      expect(id).toEqual('3333');
      throw new ApiError('empty', STATUSES.CONFLICT);
    });
    const res = await resolutionController.addResolution(
      { value: 'good' },
      { id: '1111' },
      '2222',
    );
    expect(res.getStatus).toEqual(STATUSES.CONFLICT);
  });

  test('added resolution with custom ttl', async () => {
    doctorService.getDoctorByID.mockImplementation((userID) => {
      expect(userID).toEqual('2222');
      return { first_name: 'Oleg', name: 'surgeon', doctor_id: '3333' };
    });
    queueService.isEmpty.mockImplementation((id) => {
      expect(id).toEqual('3333');
    });
    resolutionService.addResolution.mockImplementation((data) => {
      expect(data.value).toEqual('good');
      expect(data.patient_id).toEqual('1111');
      expect(data.delay).toEqual(20000);
      expect(data.doctor_name).toEqual('Oleg');
      expect(data.doctor_specialization).toEqual('surgeon');
      return { value: data.value, id: '123' };
    });
    const res = await resolutionController.addResolution(
      { value: 'good' },
      { id: '1111' },
      '2222',
      20000,
    );
    expect(res.getValue.value).toEqual('good');
    expect(res.getStatus).toEqual(STATUSES.CREATED);
  });

  test('deleted patient resolution', async () => {
    resolutionService.deleteResolution.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return { id: '2222', value: 'bad' };
    });
    const res = await resolutionController.deletePatientResolution('1111');
    expect(res.getValue.value).toEqual('bad');
    expect(res.getValue.id).toEqual('2222');
    expect(res.getStatus).toEqual(STATUSES.ACCEPTED);
  });
});
