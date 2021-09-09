import RequestResult from '../../RequestResult';
import { STATUSES } from '../../../constants';

class AuthenticationController {
  constructor(authenticationService, patientService, jwtService) {
    this.authenticationService = authenticationService;
    this.patientService = patientService;
    this.jwtService = jwtService;
  }

  async registerUser(user) {
    const res = new RequestResult();
    try {
      await this.authenticationService.isExist(user);
      const createdUser = await this.authenticationService.register(user);
      res.setValue = await this.patientService.addPatient(user, createdUser);
      res.setStatus = STATUSES.CREATED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async logIn(user) {
    const res = new RequestResult();
    try {
      res.setValue = await this.authenticationService.logIn(user);
      res.setValue = await this.jwtService.createSign(res.getValue.id);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async checkToken(token) {
    const res = new RequestResult();
    try {
      res.setValue = await this.jwtService.verifySign(token);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { AuthenticationController };
