import RequestResult from '../../helpers/RequestResult';
import { STATUSES } from '../../../constants';

class AuthenticationController {
  constructor(authenticationService, patientService, jwtService) {
    this.authenticationService = authenticationService;
    this.patientService = patientService;
    this.jwtService = jwtService;
  }

  /**
   * Register new user
   * @param {object} user
   * @returns {Promise<object>} created user and status
   */
  async registerUser(user) {
    const res = new RequestResult();
    try {
      await this.authenticationService.isExist(user);
      const createdUser = await this.authenticationService.registerUser(user);
      res.setValue = await this.patientService.createPatient(user, createdUser);
      res.setStatus = STATUSES.CREATED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Check user login
   * @param {object} user
   * @param {string} role
   * @returns {Promise<object>} created jwt token and status
   */
  async login(user, role) {
    const res = new RequestResult();
    try {
      const foundedUser = await this.authenticationService.login(user, role);
      res.setValue = this.jwtService.createSign(foundedUser.id);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Check jwt token
   * @param {string} token
   * @returns {Promise<object>} userID from jwt token and status
   */
  async checkToken(token) {
    const res = new RequestResult();
    try {
      res.setValue = this.jwtService.verifySign(token);
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
