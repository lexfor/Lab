import PatientService from '../api/patient/patient.service/patientService.js';
import PatientSQL from '../api/patient/patient.repository/patientSQL.js';
import ResolutionSQL from '../api/patient/patient.repository/resolutionSQL.js';
import QueueRedis from '../api/queue/queue.repository/queueRedis.js';

jest.mock('../api/patient/patient.repository/patientSQL.js');
jest.mock('../api/patient/patient.repository/resolutionSQL.js');
jest.mock('../api/queue/queue.repository/queueRedis.js');

describe('patient service unit tests', () => {
  const patientRepository = new PatientSQL();
  const resolutionRepository = new ResolutionSQL();
  const queueRepository = new QueueRedis();
  const patients = new PatientService(
    patientRepository,
    resolutionRepository,
    queueRepository,
  );

  test('get resolution', async () => {
    resolutionRepository.get.mockImplementation((patient) => {
      expect(patient.id).toEqual('1111');
      expect(patient.name).toEqual('Tim');
      return { id: '234', value: 'Good' };
    });
    const result = await patients.getResolution({ name: 'Tim', id: '1111' });
    expect(result.id).toEqual('234');
    expect(result.value).toEqual('Good');
  });

  test('find patient resolution by name', async () => {
    patientRepository.getByName.mockImplementation((value) => ({ id: '123', name: value }));
    resolutionRepository.get.mockImplementation((patient) => {
      expect(patient.id).toEqual('123');
      expect(patient.name).toEqual('Tim');
      return { id: '234', value: 'Good' };
    });
    const result = await patients.findPatientResolution({ name: 'Tim' });
    expect(result.id).toEqual('234');
    expect(result.value).toEqual('Good');
  });

  test('find patient resolution by id', async () => {
    patientRepository.getByID.mockImplementation((value) => ({ id: value, name: 'Tim' }));
    resolutionRepository.get.mockImplementation((patient) => {
      expect(patient.id).toEqual('1111');
      expect(patient.name).toEqual('Tim');
      return { id: '234', value: 'Good' };
    });
    const result = await patients.findPatientResolution({ id: '1111' });
    expect(result.id).toEqual('234');
    expect(result.value).toEqual('Good');
  });

  test('add patient resolution', async () => {
    patientRepository.getByID.mockImplementation((value) => ({ id: value, name: 'Tim' }));
    resolutionRepository.create.mockImplementation((patient, resolution, time) => {
      expect(patient.id).toEqual('1111');
      expect(patient.name).toEqual('Tim');
      expect(resolution).toEqual('aaaaaa');
      expect(time).toEqual(process.env.TTL_DELAY);
      return { id: '234', value: 'Good' };
    });
    const result = await patients.addPatientResolution('aaaaaa', '1111', process.env.TTL_DELAY);
    expect(result.id).toEqual('234');
    expect(result.value).toEqual('Good');
  });

  test('delete patient', async () => {
    patientRepository.getByID.mockImplementation((value) => ({ id: value, name: 'Tim' }));
    resolutionRepository.get.mockImplementation((patient) => {
      expect(patient.id).toEqual('1111');
      expect(patient.name).toEqual('Tim');
      return { id: '234', value: 'bad' };
    });
    resolutionRepository.delete.mockImplementation((resolution) => {
      expect(resolution.id).toEqual('234');
      expect(resolution.value).toEqual('bad');
    });
    const result = await patients.deletePatientResolution('1111');
    expect(result.id).toEqual('234');
    expect(result.value).toEqual('bad');
  });

  test('check is exist patient', async () => {
    patientRepository.getAllNames.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await patients.isExist({ name: 'Tim' });
    expect(result).toEqual(true);
  });

  test('check is exist patient', async () => {
    patientRepository.getAllNames.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await patients.isExist({ name: 'Anton' });
    expect(result).toEqual(false);
  });

  test('check is exist patient', async () => {
    patientRepository.getAllIDs.mockImplementation(() => ['1111', '2222', '3333']);
    const result = await patients.isExist({ id: '1111' });
    expect(result).toEqual(true);
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
