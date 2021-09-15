import { PatientService } from '../api/patient';
import { AuthenticationController, AuthenticationService, JwtService } from '../api/authentication';
import { STATUSES } from '../constants';
import ApiError from '../api/helpers/ApiError';

jest.mock('../api/authentication/service/authentication.service');
jest.mock('../api/patient/service/patient.service');
jest.mock('../api/authentication/service/jwt.service');

describe('authentication controller unit tests', () => {
  const authenticationService = new AuthenticationService();
  const patientService = new PatientService();
  const jwtService = new JwtService();
  const authenticationController = new AuthenticationController(
    authenticationService,
    patientService,
    jwtService,
  );

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

    patientService.addPatient.mockImplementation((user, createdUser) => {
      expect(createdUser.id).toEqual('1111');
      expect(user.birthday).toEqual('2001-02-18');
      expect(user.gender).toEqual('male');
      expect(user.name).toEqual('Tim');
      expect(user.login).toEqual('thetim182001@mail.ru');
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
    expect(res.getStatus).toEqual(STATUSES.CREATED);
  });

  test('cant register already existed user', async () => {
    authenticationService.isExist.mockImplementation((user) => {
      expect(user.login).toEqual('thetim182001@mail.ru');
      expect(user.password).toEqual('123');
      expect(user.birthday).toEqual('2001-02-18');
      expect(user.gender).toEqual('male');
      expect(user.name).toEqual('Tim');
      throw new ApiError('user already exist', STATUSES.BAD_REQUEST);
    });

    const res = await authenticationController.registerUser({
      login: 'thetim182001@mail.ru',
      password: '123',
      name: 'Tim',
      birthday: '2001-02-18',
      gender: 'male',
    });
    expect(res.getStatus).toEqual(STATUSES.BAD_REQUEST);
  });

  test('correct patient authentication', async () => {
    authenticationService.patientLogin.mockImplementation((user) => {
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

    const res = await authenticationController.patientLogin({
      login: 'thetim182001@mail.ru',
      password: '123',
    });
    expect(res.getValue).toEqual('asdwav');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('correct doctor authentication', async () => {
    authenticationService.doctorLogin.mockImplementation((user) => {
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

    const res = await authenticationController.doctorLogin({
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
