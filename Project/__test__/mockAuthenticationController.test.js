import AuthenticationService from '../api/authentication/authentication.service';
import PatientService from '../api/patient/patient.service';
import JwtService from '../api/authentication/authentication.service/jwtService.js';
import AuthenticationController from '../api/authentication/authentication.controller';
import { NOT_AVAILABLE, STATUSES } from '../constants';

jest.mock('../api/authentication/authentication.service');
jest.mock('../api/patient/patient.service');
jest.mock('../api/authentication/authentication.service/jwtService.js');

describe('authentication controller unit tests', () => {
  const authenticationService = new AuthenticationService();
  const patientService = new PatientService();
  const jwtService = new JwtService();
  const authenticationController = new AuthenticationController(
    authenticationService,
    patientService,
    jwtService,
  );

  test('check not existed user', async () => {
    authenticationService.isExist.mockImplementation((user) => {
      expect(user.login).toEqual('thetim182001@mail.ru');
      expect(user.password).toEqual('123');
      expect(user.birthday).toEqual('2001-02-18');
      expect(user.gender).toEqual('male');
      expect(user.name).toEqual('Tim');
      return false;
    });
    const res = await authenticationController.checkIsUserExist({
      login: 'thetim182001@mail.ru',
      password: '123',
      name: 'Tim',
      birthday: '2001-02-18',
      gender: 'male',
    });
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('check existed user', async () => {
    authenticationService.isExist.mockImplementation((user) => {
      expect(user.login).toEqual('thetim182001@mail.ru');
      expect(user.password).toEqual('123');
      expect(user.birthday).toEqual('2001-02-18');
      expect(user.gender).toEqual('male');
      expect(user.name).toEqual('Tim');
      return true;
    });
    const res = await authenticationController.checkIsUserExist({
      login: 'thetim182001@mail.ru',
      password: '123',
      name: 'Tim',
      birthday: '2001-02-18',
      gender: 'male',
    });
    expect(res.getValue.name).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('register new user', async () => {
    authenticationService.isExist.mockImplementation((user) => {
      expect(user.login).toEqual('thetim182001@mail.ru');
      expect(user.password).toEqual('123');
      expect(user.birthday).toEqual('2001-02-18');
      expect(user.gender).toEqual('male');
      expect(user.name).toEqual('Tim');
      return false;
    });

    authenticationService.register.mockImplementation((user) => {
      expect(user.login).toEqual('thetim182001@mail.ru');
      expect(user.password).toEqual('123');
      expect(user.birthday).toEqual('2001-02-18');
      expect(user.gender).toEqual('male');
      expect(user.name).toEqual('Tim');
      return {
        login: 'thetim182001@mail.ru',
        id: '1111',
      };
    });

    patientService.addPatient.mockImplementation((UserID, name, birthday, gender, email) => {
      expect(UserID).toEqual('1111');
      expect(birthday).toEqual('2001-02-18');
      expect(gender).toEqual('male');
      expect(name).toEqual('Tim');
      expect(email).toEqual('thetim182001@mail.ru');
      return {
        email: 'thetim182001@mail.ru',
        birthday: '2001-02-18',
        gender: 'male',
        name: 'Tim',
      };
    });

    const res = await authenticationController.registerUser({
      login: 'thetim182001@mail.ru',
      password: '123',
      name: 'Tim',
      birthday: '2001-02-18',
      gender: 'male',
    });
    expect(res.getValue.email).toEqual('thetim182001@mail.ru');
    expect(res.getValue.birthday).toEqual('2001-02-18');
    expect(res.getValue.gender).toEqual('male');
    expect(res.getValue.name).toEqual('Tim');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('cant register already existed user', async () => {
    authenticationService.isExist.mockImplementation((user) => {
      expect(user.login).toEqual('thetim182001@mail.ru');
      expect(user.password).toEqual('123');
      expect(user.birthday).toEqual('2001-02-18');
      expect(user.gender).toEqual('male');
      expect(user.name).toEqual('Tim');
      return true;
    });

    const res = await authenticationController.registerUser({
      login: 'thetim182001@mail.ru',
      password: '123',
      name: 'Tim',
      birthday: '2001-02-18',
      gender: 'male',
    });
    expect(res.getValue.name).toEqual(NOT_AVAILABLE);
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('correct authentication', async () => {
    authenticationService.logIn.mockImplementation((user) => {
      expect(user.login).toEqual('thetim182001@mail.ru');
      expect(user.password).toEqual('123');
      return {
        id: '2222',
        login: user.login,
      };
    });

    jwtService.createSign.mockImplementation((userID) => {
      expect(userID).toEqual('2222');
      return 'asdwav';
    });

    const res = await authenticationController.logIn({
      login: 'thetim182001@mail.ru',
      password: '123',
    });
    expect(res.getValue).toEqual('asdwav');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('check correct jwt token', async () => {
    jwtService.verifySign.mockImplementation((token) => {
      expect(token).toEqual('asdwav');
      return '1111';
    });

    const res = await authenticationController.checkToken('asdwav');
    expect(res.getValue).toEqual('1111');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });
});
