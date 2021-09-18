import * as bcrypt from 'bcrypt';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class AuthenticationService {
  constructor(authenticationRepository) {
    this.authenticationRepository = authenticationRepository;
  }

  async register(user) {
    const cryptUser = {
      login: user.login,
      password: await bcrypt.hashSync(user.password, +process.env.SALT),
    };
    const createdUser = await this.authenticationRepository.create(cryptUser);
    return createdUser;
  }

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

  async isExist(user) {
    const values = await this.authenticationRepository.getAllLogins();
    if (values.indexOf(user.login) !== -1) {
      throw new ApiError('user already exist', STATUSES.BAD_REQUEST);
    }
  }
}

export { AuthenticationService };
