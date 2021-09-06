import * as bcrypt from 'bcrypt';
import AuthenticationService from '../api/authentication/authentication.service';
import PatientRepository from '../api/patient/patient.repository';
import AuthenticationRepository from '../api/authentication/authentication.repository';

jest.mock('../api/authentication/authentication.repository');
jest.mock('../api/patient/patient.repository');
jest.mock('bcrypt');

describe('authentication service unit tests', () => {
  const patientRepository = new PatientRepository();
  const authenticationRepository = new AuthenticationRepository();
  const authenticationService = new AuthenticationService(
    authenticationRepository,
    patientRepository,
  );

  test('create new user', async () => {
    authenticationRepository.create.mockImplementation((user) => {
      expect(user.login).toEqual('thetim182001@mail.ru');
      expect(user.birthday).toEqual('2001-02-18');
      expect(user.gender).toEqual('male');
      expect(user.name).toEqual('Tim');
      return { id: '2222', login: 'thetim182001@mail.ru' };
    });
    const res = await authenticationService.register({
      login: 'thetim182001@mail.ru',
      password: '123',
      name: 'Tim',
      birthday: '2001-02-18',
      gender: 'male',
    });
    expect(res.id).toEqual('2222');
    expect(res.login).toEqual('thetim182001@mail.ru');
  });

  test('not correct authentication user', async () => {
    authenticationRepository.getUser.mockImplementation((login) => {
      expect(login).toEqual('thetim182001@mail.ru');
      return {
        id: '2222',
        password: '123',
      };
    });
    bcrypt.compareSync.mockImplementation((password, cryptPassword) => {
      expect(password).toEqual('222');
      expect(cryptPassword).toEqual('123');
      return false;
    });
    const result = await authenticationService.logIn({
      login: 'thetim182001@mail.ru',
      password: '222',
    });
    expect(result).toEqual('wrong password');
  });

  test('correct authentication user', async () => {
    authenticationRepository.getUser.mockImplementation((login) => {
      expect(login).toEqual('thetim182001@mail.ru');
      return {
        id: '2222',
        login: 'thetim182001@mail.ru',
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
    });
  });

  test('check existed user', async () => {
    authenticationRepository.getAllLogins.mockResolvedValue(['thetim182001@mail.ru', 'aliceAndreeva@mail.ru']);

    const result = await authenticationService.isExist({
      login: 'thetim182001@mail.ru',
      password: '123',
    });
    expect(result).toEqual(true);
  });

  test('check not existed user', async () => {
    authenticationRepository.getAllLogins.mockResolvedValue(['aliceAndreeva@mail.ru']);

    const result = await authenticationService.isExist({
      login: 'thetim182001@mail.ru',
      password: '123',
    });
    expect(result).toEqual(false);
  });
});
