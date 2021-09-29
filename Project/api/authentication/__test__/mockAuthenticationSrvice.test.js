import * as bcrypt from 'bcrypt';
import { AuthenticationService, AuthenticationRepository } from '../index';
import { PatientRepository } from '../../patient';

jest.mock('../repository/authentication.repository');
jest.mock('../../patient/repository/patient.repository');
jest.mock('bcrypt');

describe('authentication service unit tests', () => {
  const patientRepository = new PatientRepository();
  const authenticationRepository = new AuthenticationRepository();
  const authenticationService = new AuthenticationService(
    authenticationRepository,
    patientRepository,
  );

  test('create new user', async () => {
    authenticationRepository.createUser.mockImplementation((user) => {
      expect(user.login).toEqual('thetim182001@mail.ru');
      return { id: '2222', login: 'thetim182001@mail.ru' };
    });
    const res = await authenticationService.registerUser({
      login: 'thetim182001@mail.ru',
      password: '123',
      name: 'Tim',
      birthday: '2001-02-18',
      gender: 'male',
    });
    expect(res.id).toEqual('2222');
    expect(res.login).toEqual('thetim182001@mail.ru');
  });

  test('correct patient authentication', async () => {
    authenticationRepository.getUser.mockImplementation((login, role) => {
      expect(login).toEqual('thetim182001@mail.ru');
      expect(role).toEqual('patient');
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

    await authenticationService.login({
      login: 'thetim182001@mail.ru',
      password: '123',
    }, 'patient');
  });
});
