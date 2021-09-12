// import RequestResult from '../../RequestResult';
// import { checkOutputStatus } from '../../helpers/StatusHelper';
// import { STATUSES, NOT_AVAILABLE } from '../../../constants';
import jwt from 'jsonwebtoken';
// import { injector } from '../../../Injector';

export default class DoctorController {
  constructor(services) {
    this.services = services;
  }

  async login(req, res, injector) {
    const { login, password } = req.body;

    const user = await injector.doctorRepository.findDoctorByLogin(login);

    if (user.password === password) {
      const token = jwt.sign({ user_id: user.id }, process.env.TOKEN_KEY);

      res.send({ jwt: token, user_id: user.id });
    }
  }

  async getAllSpetialization(req, res, injector) {
    const allSpecializations = await injector.doctorRepository.getAllSpecializations();

    if (allSpecializations) {
      res.send(allSpecializations);
    } else {
      res.send({ error: 'error' });
    }
  }

  async allDoctorsBySpecializations(req, res, injector) {
    const { typeID } = req.query;
    const allDoctorsBySpec = await injector.doctorRepository.allDoctorsBySpecializations(typeID);

    if (allDoctorsBySpec) {
      res.send(allDoctorsBySpec);
    } else {
      res.send({ error: 'error' });
    }
  }
}
