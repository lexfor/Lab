import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { NOT_AVAILABLE } from '../../constants.js';

const { sign } = jwt;

export default class AuthenticationService {
  constructor(authenticationRepository, patientRepository) {
    this.authenticationRepository = authenticationRepository;
    this.patientRepository = patientRepository;
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
    const patient = await this.patientRepository.create(
      createdUser.id,
      user.name,
      user.birthday,
      user.gender,
    );
    return patient;
  }

  async logIn(user, secretToken = process.env.TOKEN_KEY) {
    const patient = await this.authenticationRepository.getPatientByLogin(user.login);
    if (!patient) {
      return 'no such user';
    }
    if (bcrypt.compareSync(user.password, patient.password)) {
      const token = sign({
        id: patient.id,
        name: patient.name,
        birthday: patient.birthday,
        gender: patient.gender,
      }, secretToken);
      return token;
    }
    return NOT_AVAILABLE;
  }

  async isExist(user) {
    const values = await this.authenticationRepository.getAllLogins();
    return values.indexOf(user.login) !== -1;
  }
}
