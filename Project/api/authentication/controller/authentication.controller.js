import RequestResult from '../../RequestResult';
import { checkOutputStatus } from '../../helpers/StatusHelper';
import { STATUSES, NOT_AVAILABLE } from '../../../constants';

class AuthenticationController {
  constructor(authenticationService, patientService, jwtService) {
    this.authenticationService = authenticationService;
    this.patientService = patientService;
    this.jwtService = jwtService;
  }

  async checkIsUserExist(user) {
    const res = new RequestResult();
    if (await this.authenticationService.isExist(user)) {
      res.setValue = { name: NOT_AVAILABLE };
      res.setStatus = STATUSES.UNAVAILABLE;
    }
    return res;
  }

  async registerUser(user) {
    const res = await this.checkIsUserExist(user);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    const createdUser = await this.authenticationService.register(user);
    res.setValue = await this.patientService.addPatient(
      createdUser.id,
      user.name,
      user.birthday,
      user.gender,
      user.login,
    );
    return checkOutputStatus(res);
  }

  async logIn(user) {
    const res = new RequestResult();
    res.setValue = await this.authenticationService.logIn(user);
    checkOutputStatus(res);
    if (res.getStatus === STATUSES.OK) {
      res.setValue = await this.jwtService.createSign(res.getValue.id);
    } else {
      return res;
    }
    return checkOutputStatus(res);
  }

  async checkToken(token) {
    const res = new RequestResult();
    res.setValue = await this.jwtService.verifySign(token);
    return checkOutputStatus(res);
  }
}

export { AuthenticationController }
