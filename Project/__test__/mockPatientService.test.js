import PatientRepository from '../api/patient/patient.repository';
import PatientService from '../api/patient/patient.service';

jest.mock('../api/patient/patient.repository/index.js');

describe('patient service unit tests', () => {
  const patientRepository = new PatientRepository();
  const patientService = new PatientService(
    patientRepository,
  );

  test('create new patient', async () => {
    patientRepository.create.mockImplementation((userID, name, birthday, gender, email) => {
      expect(userID).toEqual('1111');
      expect(name).toEqual('Tim');
      expect(birthday).toEqual('2021-02-18');
      expect(gender).toEqual('male');
      expect(email).toEqual('thetim182001@mail.ru');
      return { id: '2222', name: 'Tim' };
    });
    const result = await patientService.addPatient(
      '1111',
      'Tim',
      '2021-02-18',
      'male',
      'thetim182001@mail.ru',
    );
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

  test('find patient with user id', async () => {
    patientRepository.getByUserID.mockImplementation((patientID) => {
      expect(patientID).toEqual('1111');
      return { id: '2222', name: 'Tim' };
    });
    const result = await patientService.findPatient({ user_id: '1111' });
    expect(result).toEqual('2222');
  });

  test('check existed patient by name', async () => {
    patientRepository.getAllNames.mockResolvedValue(['Tim', 'Andrei', 'Dima']);
    const result = await patientService.isExist({ name: 'Tim' });
    expect(result).toEqual(true);
  });

  test('check existed patient by user id', async () => {
    patientRepository.getByUserID.mockImplementation((userID) => {
      expect(userID).toEqual('123');
      return { id: '1111' };
    });
    patientRepository.getAllIDs.mockResolvedValue(['2222', '1111', '3333']);
    const result = await patientService.isExist({ user_id: '123' });
    expect(result).toEqual(true);
  });

  test('check existed patient by patient id', async () => {
    patientRepository.getAllIDs.mockResolvedValue(['1111', '2222', '3333']);
    const result = await patientService.isExist({ id: '1111' });
    expect(result).toEqual(true);
  });

  test('check not existed patient by patient id', async () => {
    patientRepository.getAllIDs.mockResolvedValue(['1111', '2222', '3333']);
    const result = await patientService.isExist({ id: '4444' });
    expect(result).toEqual(false);
  });

  test('check is no patients', async () => {
    patientRepository.getAllNames.mockResolvedValue(['1111', '2222', '3333']);
    const result = await patientService.isEmpty();
    expect(result).toEqual(false);
  });

  test('check is no patients', async () => {
    patientRepository.getAllNames.mockResolvedValue([]);
    const result = await patientService.isEmpty();
    expect(result).toEqual(true);
  });
});
