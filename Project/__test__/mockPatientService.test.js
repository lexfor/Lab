import PatientService from '../api/service/PatientService.js';
import PatientSQL from '../api/repositories/patient.repositories/patientSQL.js';
import ResolutionSQL from '../api/repositories/resolution.repositories/resolutionSQL.js';
import QueueRedis from '../api/repositories/queue.repositories/queueRedis.js';

jest.mock('../api/repositories/patient.repositories/patientSQL.js');
jest.mock('../api/repositories/resolution.repositories/resolutionSQL.js');
jest.mock('../api/repositories/queue.repositories/queueRedis.js');

describe('patient service unit tests', () => {
  const patientRepository = new PatientSQL();
  const resolutionRepository = new ResolutionSQL();
  const queueRepository = new QueueRedis();
  const patients = new PatientService(
    patientRepository,
    resolutionRepository,
    queueRepository,
  );

  test('find patient resolution', async () => {
    patientRepository.getByName.mockImplementation((value) => ({ id: '123', name: value }));
    resolutionRepository.get.mockImplementation((patient) => {
      expect(patient.id).toEqual('123');
      expect(patient.name).toEqual('Tim');
      return { id: '234', value: 'Good' };
    });
    const result = await patients.findPatientResolution('Tim');
    expect(result).toEqual({ id: '234', value: 'Good' });
  });

  test('add patient resolution', async () => {
    queueRepository.getFirst.mockResolvedValue('123');
    patientRepository.getByID.mockImplementation((value) => ({ id: value, name: 'Tim' }));
    resolutionRepository.create.mockImplementation((patient, resolution, time) => {
      expect(patient.id).toEqual('123');
      expect(patient.name).toEqual('Tim');
      expect(resolution).toEqual('aaaaaa');
      expect(time).toEqual(process.env.TTL_DELAY);
      return { id: '234', value: 'Good' };
    });
    const result = await patients.addPatientResolution('aaaaaa', process.env.TTL_DELAY);
    expect(result).toEqual({ id: '234', value: 'Good' });
  });

  test('delete patient', async () => {
    patientRepository.getByName.mockImplementation((value) => ({ id: '123', name: value }));
    resolutionRepository.get.mockImplementation((patient) => {
      expect(patient.id).toEqual('123');
      expect(patient.name).toEqual('Tim');
      return { id: '234', value: 'bad' };
    });
    resolutionRepository.delete.mockImplementation((resolution) => {
      expect(resolution.id).toEqual('234');
      expect(resolution.value).toEqual('bad');
    });
    const result = await patients.deletePatientResolution('Tim');
    expect(result).toEqual({ id: '234', value: 'bad' });
  });

  test('check is exist patient', async () => {
    patientRepository.getAllNames.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await patients.isExist('Tim');
    expect(result).toEqual(true);
  });

  test('check is exist patient', async () => {
    patientRepository.getAllNames.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await patients.isExist('Anton');
    expect(result).toEqual(false);
  });

  test('check is patient storage empty', async () => {
    patientRepository.getAllNames.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await patients.isEmpty();
    expect(result).toEqual(false);
  });

  test('check is patient storage empty', async () => {
    patientRepository.getAllNames.mockImplementation(() => []);
    const result = await patients.isEmpty();
    expect(result).toEqual(true);
  });
});
