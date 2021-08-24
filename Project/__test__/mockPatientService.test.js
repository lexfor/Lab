import PatientService from '../api/service/PatientService.js';
import { patientInMemoryStorage } from '../api/repositories/patientStorage.js';
import { resolutionInMemoryStorage } from '../api/repositories/resolutionStorage.js';

jest.mock('../api/repositories/patientStorage.js');
jest.mock('../api/repositories/resolutionStorage.js');

describe('patient service unit tests', () => {
  const patients = new PatientService(
    patientInMemoryStorage,
    resolutionInMemoryStorage,
  );

  test('create patient', async () => {
    patientInMemoryStorage.create.mockResolvedValue('abc');
    resolutionInMemoryStorage.create.mockResolvedValue('123');
    patientInMemoryStorage.update.mockImplementation((patientID, name, resolutionID) => {
      expect(patientID).toEqual('abc');
      expect(name).toEqual('Tim');
      expect(resolutionID).toEqual('123');
    });
    await patients.createPatient('Tim');
  });

  test('find patient resolution id', async () => {
    patientInMemoryStorage.find.mockResolvedValue('123');
    resolutionInMemoryStorage.getResolutionID.mockImplementation((id) => {
      expect(id).toEqual('123');
      return '234';
    });
    const result = await patients.findResolutionID('Tim');
    expect(result).toEqual('234');
  });

  test('update patient resolution', async () => {
    patientInMemoryStorage.find.mockImplementation((value) => {
      expect(value).toEqual('Tim');
    });
    resolutionInMemoryStorage.getResolutionID.mockResolvedValue('abc');
    resolutionInMemoryStorage.update.mockImplementation((resolutionID, resolution, time) => {
      expect(resolutionID).toEqual('abc');
      expect(resolution).toEqual('aaaaaa');
      expect(time).toEqual(process.env.TTL_DELAY);
    });
    const result = await patients.addResolution('Tim', 'aaaaaa', process.env.TTL_DELAY);
    expect(result).toEqual('updated');
  });

  test('get patient name', async () => {
    patientInMemoryStorage.get.mockImplementation((id) => {
      expect(id).toEqual('123');
      return 'Tim';
    });
    const result = await patients.getPatientName('123');
    expect(result).toEqual('Tim');
  });

  test('get patient resolution', async () => {
    patientInMemoryStorage.find.mockImplementation((value) => {
      expect(value).toEqual('Tim');
    });
    resolutionInMemoryStorage.getResolutionID.mockResolvedValue('abc');
    resolutionInMemoryStorage.get.mockImplementation((resolutionID) => {
      expect(resolutionID).toEqual('abc');
      return 'aaaaaa';
    });
    const result = await patients.getResolution('Tim');
    expect(result).toEqual('aaaaaa');
  });

  test('delete patient', async () => {
    patientInMemoryStorage.find.mockImplementation((value) => {
      expect(value).toEqual('Tim');
    });
    resolutionInMemoryStorage.getResolutionID.mockResolvedValue('abc');
    resolutionInMemoryStorage.delete.mockImplementation((resolutionID) => {
      expect(resolutionID).toEqual('abc');
    });
    const result = await patients.deleteResolution('Tim');
  });

  test('get all patients names', async () => {
    patientInMemoryStorage.getAllNames.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await patients.getAllPatientNames('Tim');
    expect(result).toEqual(['Tim', 'Dima', 'Andrei']);
  });

  test('check is exist patient', async () => {
    patientInMemoryStorage.getAllNames.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await patients.isExist('Tim');
    expect(result).toEqual(true);
  });

  test('check is exist patient', async () => {
    patientInMemoryStorage.getAllNames.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await patients.isExist('Anton');
    expect(result).toEqual(false);
  });

  test('check is patient storage empty', async () => {
    patientInMemoryStorage.getAllNames.mockImplementation(() => ['Tim', 'Dima', 'Andrei']);
    const result = await patients.isEmpty();
    expect(result).toEqual(false);
  });

  test('check is patient storage empty', async () => {
    patientInMemoryStorage.getAllNames.mockImplementation(() => []);
    const result = await patients.isEmpty();
    expect(result).toEqual(true);
  });
});
