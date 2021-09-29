import { PatientService, PatientRepository } from '../index';

jest.mock('../repository/patient.repository');

describe('patient service unit tests', () => {
  const patientRepository = new PatientRepository();
  const patientService = new PatientService(
    patientRepository,
  );

  test('create new patient', async () => {
    patientRepository.createPatient.mockImplementation((patientData) => {
      expect(patientData.user_id).toEqual('1111');
      expect(patientData.name).toEqual('Tim');
      expect(patientData.birthday).toEqual('2021-02-18');
      expect(patientData.gender).toEqual('male');
      expect(patientData.mail).toEqual('thetim182001@mail.ru');
      return { id: '2222', name: 'Tim' };
    });
    const result = await patientService.createPatient({
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
    patientRepository.getPatientByUserID.mockImplementation((userID) => {
      expect(userID).toEqual('1111');
      return { id: '2222', name: 'Tim' };
    });
    const result = await patientService.getPatientByUser('1111');
    expect(result.id).toEqual('2222');
    expect(result.name).toEqual('Tim');
  });

  test('find patient by patient id', async () => {
    patientRepository.getPatientByID.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return { id: patientID, name: 'Tim' };
    });
    const result = await patientService.getPatientByID('1111');
    expect(result.id).toEqual('1111');
    expect(result.name).toEqual('Tim');
  });

  test('get all patient with condition', async () => {
    patientRepository.getAllPatients.mockImplementation((patientInfo) => {
      expect(patientInfo).toEqual('Tim');
      return [{ id: '1111', name: 'Tim' }];
    });
    const result = await patientService.getAllPatients('Tim');
    expect(result[0].id).toEqual('1111');
    expect(result[0].name).toEqual('Tim');
  });
});
