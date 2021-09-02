import * as bcrypt from 'bcrypt';
import AuthenticationService from '../api/service/authenticationService.js';
import PatientSQL from '../api/repositories/patient.repositories/patientSQL.js';
import AuthenticationSQL from '../api/repositories/authentication.repositories/authenticationSQL.js';

jest.mock('../api/repositories/authentication.repositories/authenticationSQL.js');
jest.mock('../api/repositories/patient.repositories/patientSQL.js');
jest.mock('bcrypt');

describe('queue controller unit tests', () => {
  const patientRepository = new PatientSQL();
  const authenticationRepository = new AuthenticationSQL();
  const authenticationService = new AuthenticationService(
    authenticationRepository,
    patientRepository,
  );

  test('register user', async () => {
    authenticationRepository.create.mockImplementation((user) => {
      expect(user.login).toEqual('thetim182001@mail.ru');
      expect(user.birthday).toEqual('2001-02-18');
      expect(user.gender).toEqual('male');
      expect(user.name).toEqual('Tim');
      return { id: '2222', login: 'thetim182001@mail.ru' };
    });
    patientRepository.create.mockImplementation((id, name, birthday, gender) => {
      expect(id).toEqual('2222');
      expect(birthday).toEqual('2001-02-18');
      expect(gender).toEqual('male');
      expect(name).toEqual('Tim');
      return {
        id: '3333',
        name: 'Tim',
        birthday: '2001-02-18',
        gender: 'male',
      };
    });
    const res = await authenticationService.register({
      login: 'thetim182001@mail.ru',
      password: '123',
      name: 'Tim',
      birthday: '2001-02-18',
      gender: 'male',
    });
    expect(res.name).toEqual('Tim');
    expect(res.id).toEqual('3333');
    expect(res.birthday).toEqual('2001-02-18');
    expect(res.gender).toEqual('male');
  });

  test('authentication user', async () => {
    authenticationRepository.getPatientByLogin.mockImplementation((login) => {
      expect(login).toEqual('thetim182001@mail.ru');
      return {
        id: '2222',
        name: 'Tim',
        birthday: '2001-02-18',
        gender: 'male',
        password: '123',
      };
    });
    bcrypt.compareSync.mockImplementation((password, cryptPassword) => {
      expect(password).toEqual('222');
      expect(cryptPassword).toEqual('123');
      return false;
    });
    await authenticationService.logIn({
      login: 'thetim182001@mail.ru',
      password: '222',
    });
  });

  test('authentication user', async () => {
    authenticationRepository.getPatientByLogin.mockImplementation((login) => {
      expect(login).toEqual('thetim182001@mail.ru');
      return {
        id: '2222',
        name: 'Tim',
        birthday: '2001-02-18',
        gender: 'male',
        password: '123',
      };
    });
    bcrypt.compareSync.mockImplementation((password, cryptPassword) => {
      expect(password).toEqual('123');
      expect(cryptPassword).toEqual('123');
      return true;
    });

    await authenticationService.logIn({
      login: 'thetim182001@mail.ru',
      password: '123',
    }, '23ddsg14114A42fsethd34');
  });

  test('is user exist', async () => {
    authenticationRepository.getAllLogins.mockResolvedValue(['thetim182001@mail.ru', 'aliceAndreeva@mail.ru']);

    const result = await authenticationService.isExist({
      login: 'thetim182001@mail.ru',
      password: '123',
    });
    expect(result).toEqual(true);
  });

  test('is user exist', async () => {
    authenticationRepository.getAllLogins.mockResolvedValue(['aliceAndreeva@mail.ru']);

    const result = await authenticationService.isExist({
      login: 'thetim182001@mail.ru',
      password: '123',
    });
    expect(result).toEqual(false);
  });
});
