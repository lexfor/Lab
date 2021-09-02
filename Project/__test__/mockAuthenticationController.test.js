import AuthenticationService from '../api/service/authenticationService.js';
import AuthenticationController from '../api/controllers/authenticationController.js';
import { NOT_AVAILABLE, STATUSES } from '../constants';

jest.mock('../api/service/authenticationService.js');

describe('queue controller unit tests', () => {
  const authenticationService = new AuthenticationService();
  const authenticationController = new AuthenticationController(authenticationService);

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
      login: 'thetim182001@mail.ru',
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

    const res = await authenticationController.logIn({
      login: 'thetim182001@mail.ru',
      password: '123',
    });
    expect(res.getValue).toEqual({
      id: '2222',
      name: 'Tim',
      birthday: '2001-02-18',
      gender: 'male',
    });
    expect(res.getStatus).toEqual(STATUSES.OK);
  });
});
