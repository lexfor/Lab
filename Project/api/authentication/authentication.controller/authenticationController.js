import RequestResult from '../../RequestResult.js';
import { checkOutputStatus } from '../../helpers/StatusHelper.js';
import { STATUSES, NOT_AVAILABLE } from '../../../constants.js';

export default class AuthenticationController {
  constructor(authenticationService) {
    this.authenticationService = authenticationService;
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
    res.setValue = await this.authenticationService.register(user);
    return checkOutputStatus(res);
  }

  async logIn(user) {
    const res = new RequestResult();
    res.setValue = await this.authenticationService.logIn(user);
    return checkOutputStatus(res);
  }
}
