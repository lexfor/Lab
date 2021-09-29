import * as bcrypt from 'bcrypt';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class AuthenticationService {
  constructor(authenticationRepository) {
    this.authenticationRepository = authenticationRepository;
  }

  /**
   * Register new user
   * @param {object} user
   * @returns {Promise<object>} created user
   */
  async registerUser(user) {
    const cryptUser = {
      login: user.login,
      password: await bcrypt.hashSync(user.password, +process.env.SALT),
    };
    const createdUser = await this.authenticationRepository.createUser(cryptUser);
    return createdUser;
  }

  /**
   * Check user login
   * @param {object} user
   * @param {string} role
   * @returns {Promise<object>} founded user
   */
  async login(user, role) {
    const foundedUser = await this.authenticationRepository.getUser(user.login, role);
    if (!foundedUser) {
      throw new ApiError('no such user', STATUSES.UNAUTHORISED);
    }
    if (await bcrypt.compareSync(user.password, foundedUser.password)) {
      return foundedUser;
    }
    throw new ApiError('wrong password', STATUSES.UNAUTHORISED);
  }

  /**
   *Check is user already exist
   * @param {object} user
   */
  async isExist(user, role = 'patient') {
    const foundedUser = await this.authenticationRepository.getUser(user.login, role);
    if (foundedUser) {
      throw new ApiError('user already exist', STATUSES.BAD_REQUEST);
    }
  }
}

export { AuthenticationService };
