import PatientService from '../api/service/PatientService.js';
import { patientMemoryRepository } from '../api/repositories/patientMemory.js';
import { resolutionMemoryRepository } from '../api/repositories/resolutionMemory.js';

jest.mock('../api/repositories/patientMemory.js');
jest.mock('../api/repositories/resolutionMemory.js');

describe('patient service unit tests', () => {
  const patients = new PatientService(
    patientMemoryRepository,
    resolutionMemoryRepository,
  );

  test('create patient', async () => {
    patientMemoryRepository.create.mockResolvedValue('abc');
    resolutionMemoryRepository.create.mockResolvedValue('123');
    patientMemoryRepository.update.mockImplementation((patientID, name, resolutionID) => {
      expect(patientID).toEqual('abc');
      expect(name).toEqual('Tim');
      expect(resolutionID).toEqual('123');
    });
    await patients.createPatient('Tim');
  });

  test('find patient resolution id', async () => {
    patientMemoryRepository.find.mockResolvedValue('123');
    resolutionMemoryRepository.getResolutionID.mockImplementation((id) => {
      expect(id).toEqual('123');
      return '234';
    });
    const result = await patients.findResolutionID('Tim');
    expect(result).toEqual('234');
  });

  test('update patient resolution', async () => {
    patientMemoryRepository.find.mockImplementation((value) => {
      expect(value).toEqual('Tim');
    });
    resolutionMemoryRepository.getResolutionID.mockResolvedValue('abc');
    resolutionMemoryRepository.update.mockImplementation((resolutionID, resolution, time) => {
      expect(resolutionID).toEqual('abc');
      expect(resolution).toEqual('aaaaaa');
      expect(time).toEqual(process.env.TTL_DELAY);
    });
    const result = await patients.addResolution('Tim', 'aaaaaa', process.env.TTL_DELAY);
    expect(result).toEqual('updated');
  });

  test('get patient name', async () => {
    patientMemoryRepository.get.mockImplementation((id) => {
      expect(id).toEqual('123');
      return 'Tim';
    });
    const result = await patients.getPatientName('123');
    expect(result).toEqual('Tim');
  });

  test('get patient resolution', async () => {
    patientMemoryRepository.find.mockImplementation((value) => {
      expect(value).toEqual('Tim');
    });
    resolutionMemoryRepository.getResolutionID.mockResolvedValue('abc');
    resolutionMemoryRepository.get.mockImplementation((resolutionID) => {
      expect(resolutionID).toEqual('abc');
      return 'aaaaaa';
    });
    const result = await patients.getResolution('Tim');
    expect(result).toEqual('aaaaaa');
  });

  test('delete patient', async () => {
    patientMemoryRepository.find.mockImplementation((value) => {
      expect(value).toEqual('Tim');
    });
    resolutionMemoryRepository.getResolutionID.mockResolvedValue('abc');
    resolutionMemoryRepository.delete.mockImplementation((resolutionID) => {
      expect(resolutionID).toEqual('abc');
    });
    const result = await patients.deleteResolution('Tim');
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
