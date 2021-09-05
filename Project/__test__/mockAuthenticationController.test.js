import AuthenticationService from '../api/authentication/authentication.service/authenticationService.js';
import PatientService from '../api/patient/patient.service/patientService.js';
import JwtService from '../api/authentication/authentication.service/jwtService.js';
import AuthenticationController from '../api/authentication/authentication.controller/authenticationController.js';
import { NOT_AVAILABLE, STATUSES } from '../constants';

jest.mock('../api/authentication/authentication.service/authenticationService.js');
jest.mock('../api/patient/patient.service/patientService.js');
jest.mock('../api/authentication/authentication.service/jwtService.js');

describe('queue controller unit tests', () => {
  const authenticationService = new AuthenticationService();
  const patientService = new PatientService();
  const jwtService = new JwtService();
  const authenticationController = new AuthenticationController(authenticationService, patientService, jwtService);

  test('is user exist', async () => {
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

  test('is user exist', async () => {
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

  test('register user', async () => {
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

    patientService.addPatient.mockImplementation((UserID, name, birthday, gender, email ) => {
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
    expect(res.getValue).toEqual({
      email: 'thetim182001@mail.ru',
      birthday: '2001-02-18',
      gender: 'male',
      name: 'Tim',
    });
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('register existed user', async () => {
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

  test('login user', async () => {
    authenticationService.logIn.mockImplementation((user) => {
      expect(user.login).toEqual('thetim182001@mail.ru');
      expect(user.password).toEqual('123');
      return {
        id: '2222',
        name: 'Tim',
        birthday: '2001-02-18',
        gender: 'male',
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
});
