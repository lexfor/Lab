import * as bcrypt from 'bcrypt';

export default class AuthenticationService {
  constructor(authenticationRepository) {
    this.authenticationRepository = authenticationRepository;
  }

  async register(user) {
    const cryptUser = {
      login: user.login,
      password: bcrypt.hashSync(user.password, 10),
      name: user.name,
      birthday: user.birthday,
      gender: user.gender,
    };
    const createdUser = await this.authenticationRepository.create(cryptUser);
    return createdUser;
  }

  async logIn(user) {
    const foundedUser = await this.authenticationRepository.getUser(user.login);
    if (!foundedUser) {
      return 'no such user';
    }
    if (bcrypt.compareSync(user.password, foundedUser.password)) {
      return foundedUser;
    }
    return 'wrong password';
  }

  async isExist(user) {
    const values = await this.authenticationRepository.getAllLogins();
    return values.indexOf(user.login) !== -1;
  }
}
