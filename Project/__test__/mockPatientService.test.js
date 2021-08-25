import PatientService from '../api/service/PatientService.js';
import ResolutionService from '../api/service/ResolutionService.js';
import { patientMemoryRepository } from '../api/repositories/patient.repositories/patientMemory.js';
import { resolutionMemoryRepository } from '../api/repositories/resolution.repositories/resolutionMemory.js';

jest.mock('../api/repositories/patient.repositories/patientMemory.js');
jest.mock('../api/service/ResolutionService.js');

describe('patient service unit tests', () => {
  const resolutions = new ResolutionService(resolutionMemoryRepository);
  const patients = new PatientService(
    patientMemoryRepository,
    resolutions,
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

  test('find patient resolution id', async () => {
    patientMemoryRepository.find.mockImplementation((value) => ({ id: '123', name: value }));
    resolutions.findResolution.mockImplementation((patient) => {
      expect(patient.id).toEqual('123');
      expect(patient.name).toEqual('Tim');
      return { id: '234', value: 'Good' };
    });
    const result = await patients.findResolution('Tim');
    expect(result.id).toEqual('234');
    expect(result.value).toEqual('Good');
  });

  test('add patient resolution', async () => {
    patientMemoryRepository.find.mockImplementation((value) => ({ id: '123', name: value }));
    resolutions.addResolution.mockImplementation((patient, resolution, time) => {
      expect(patient.id).toEqual('123');
      expect(patient.name).toEqual('Tim');
      expect(resolution).toEqual('aaaaaa');
      expect(time).toEqual(process.env.TTL_DELAY);
      return { id: '234', value: 'Good' };
    });
    const result = await patients.addResolution('Tim', 'aaaaaa', process.env.TTL_DELAY);
    expect(result.id).toEqual('234');
    expect(result.value).toEqual('Good');
  });

  test('get patient name', async () => {
    patientMemoryRepository.get.mockImplementation((patientID) => {
      expect(patientID).toEqual('123');
      return { name: 'Tim', id: patientID };
    });
    const result = await patients.getPatient('123');
    expect(result.name).toEqual('Tim');
    expect(result.id).toEqual('123');
  });

  test('get patient resolution', async () => {
    patientMemoryRepository.find.mockImplementation((value) => ({ id: '123', name: value }));
    resolutions.findResolution.mockImplementation((patient) => {
      expect(patient.id).toEqual('123');
      expect(patient.name).toEqual('Tim');
      return { id: '234', value: 'Good' };
    });
    const result = await patients.getResolutionValue('Tim');
    expect(result).toEqual('Good');
  });

  test('delete patient', async () => {
    patientMemoryRepository.find.mockImplementation((value) => ({ id: '123', name: value }));
    resolutions.deleteResolution.mockImplementation((patient) => {
      expect(patient.id).toEqual('123');
      expect(patient.name).toEqual('Tim');
      return { id: '234', value: 'bad' };
    });
    const result = await patients.deleteResolution('Tim');
    expect(result.id).toEqual('123');
    expect(result.name).toEqual('Tim');
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
