import PatientService from '../api/service/PatientService.js';
import { patientMemoryRepository } from '../api/repositories/patient.repositories/patientMemory.js';
import { resolutionMemoryRepository } from '../api/repositories/resolution.repositories/resolutionMemory.js';
import { queueMemoryRepository } from '../api/repositories/queue.repositories/queueMemory.js';

jest.mock('../api/repositories/patient.repositories/patientMemory.js');
jest.mock('../api/repositories/resolution.repositories/resolutionMemory.js');
jest.mock('../api/repositories/queue.repositories/queueMemory.js');

describe('patient service unit tests', () => {
  const patients = new PatientService(
    patientMemoryRepository,
    resolutionMemoryRepository,
    queueMemoryRepository,
  );

  test('create patient', async () => {
    patientMemoryRepository.create.mockImplementation((value) => {
      expect(value).toEqual('Tim');
      return { id: '123', name: value };
    });
    const result = await patients.createPatient('Tim');
    expect(result.id).toEqual('123');
    expect(result.name).toEqual('Tim');
  });

  test('find patient resolution', async () => {
    patientMemoryRepository.getByName.mockImplementation((value) => ({ id: '123', name: value }));
    resolutionMemoryRepository.get.mockImplementation((patient) => {
      expect(patient.id).toEqual('123');
      expect(patient.name).toEqual('Tim');
      return { id: '234', value: 'Good' };
    });
    const result = await patients.findPatientResolution('Tim');
    expect(result).toEqual('Good');
  });

  test('add patient resolution', async () => {
    queueMemoryRepository.getFirst.mockResolvedValue('123');
    patientMemoryRepository.getByID.mockImplementation((value) => ({ id: value, name: 'Tim' }));
    resolutionMemoryRepository.create.mockImplementation((patient, resolution, time) => {
      expect(patient.id).toEqual('123');
      expect(patient.name).toEqual('Tim');
      expect(resolution).toEqual('aaaaaa');
      expect(time).toEqual(process.env.TTL_DELAY);
      return { id: '234', value: 'Good' };
    });
    const result = await patients.addPatientResolution('aaaaaa', process.env.TTL_DELAY);
    expect(result).toEqual('Good');
  });

  test('delete patient', async () => {
    patientMemoryRepository.getByName.mockImplementation((value) => ({ id: '123', name: value }));
    resolutionMemoryRepository.get.mockImplementation((patient) => {
      expect(patient.id).toEqual('123');
      expect(patient.name).toEqual('Tim');
      return { id: '234', value: 'bad' };
    });
    resolutionMemoryRepository.delete.mockImplementation((resolution) => {
      expect(resolution.id).toEqual('234');
      expect(resolution.value).toEqual('bad');
    });
    const result = await patients.deletePatientResolution('Tim');
    expect(result).toEqual('bad');
  });

  test('get all patients names', async () => {
    patientMemoryRepository.getAllNames.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await patients.getAllPatientNames('Tim');
    expect(result).toEqual(['Tim', 'Dima', 'Andrei']);
  });

  test('check is exist patient', async () => {
    patientMemoryRepository.getAllNames.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await patients.isExist('Tim');
    expect(result).toEqual(true);
  });

  test('check is exist patient', async () => {
    patientMemoryRepository.getAllNames.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await patients.isExist('Anton');
    expect(result).toEqual(false);
  });

  test('check is patient storage empty', async () => {
    patientMemoryRepository.getAllNames.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await patients.isEmpty();
    expect(result).toEqual(false);
  });

  test('check is patient storage empty', async () => {
    patientMemoryRepository.getAllNames.mockImplementation(() => []);
    const result = await patients.isEmpty();
    expect(result).toEqual(true);
  });
});
