import { PatientService, PatientRepository } from '../api/patient';

jest.mock('../api/patient/repository/patient.repository');

describe('patient service unit tests', () => {
  const patientRepository = new PatientRepository();
  const patientService = new PatientService(
    patientRepository,
  );

  test('create new patient', async () => {
    patientRepository.create.mockImplementation((patientData) => {
      expect(patientData.user_id).toEqual('1111');
      expect(patientData.name).toEqual('Tim');
      expect(patientData.birthday).toEqual('2021-02-18');
      expect(patientData.gender).toEqual('male');
      expect(patientData.mail).toEqual('thetim182001@mail.ru');
      return { id: '2222', name: 'Tim' };
    });
    const result = await patientService.addPatient({
      name: 'Tim',
      birthday: '2021-02-18',
      gender: 'male',
      login: 'thetim182001@mail.ru',
    }, {
      id: '1111',
    });
    expect(result.id).toEqual('2222');
    expect(result.name).toEqual('Tim');
  });

  test('find patient by user id', async () => {
    patientRepository.getByUserID.mockImplementation((userID) => {
      expect(userID).toEqual('1111');
      return { id: '2222', name: 'Tim' };
    });
    const result = await patientService.findPatientByUser('1111');
    expect(result.id).toEqual('2222');
    expect(result.name).toEqual('Tim');
  });

  test('find patient by patient name', async () => {
    patientRepository.getByName.mockImplementation((patientName) => {
      expect(patientName).toEqual('Tim');
      return { id: '2222', name: patientName };
    });
    const result = await patientService.findPatientByName('Tim');
    expect(result.id).toEqual('2222');
    expect(result.name).toEqual('Tim');
  });

  test('find patient by patient id', async () => {
    patientRepository.getByID.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return { id: patientID, name: 'Tim' };
    });
    const result = await patientService.findPatientByID('1111');
    expect(result.id).toEqual('1111');
    expect(result.name).toEqual('Tim');
  });

  test('find patient with name', async () => {
    patientRepository.getByName.mockImplementation((patientName) => {
      expect(patientName).toEqual('Tim');
      return { id: '1111', name: patientName };
    });
    const result = await patientService.findPatient({ name: 'Tim' });
    expect(result).toEqual('1111');
  });

  test('get all patient with condition', async () => {
    patientRepository.getAllPatientWithConditions.mockImplementation((patientInfo) => {
      expect(patientInfo).toEqual('Tim');
      return [{ id: '1111', name: 'Tim' }];
    });
    const result = await patientService.getAllPatientWithCondition('Tim');
    expect(result[0].id).toEqual('1111');
    expect(result[0].name).toEqual('Tim');
  });

  test('find patient with user id', async () => {
    patientRepository.getByUserID.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return { id: '2222', name: 'Tim' };
    });
    const result = await patientService.findPatient({ user_id: '1111' });
    expect(result).toEqual('2222');
  });
});
