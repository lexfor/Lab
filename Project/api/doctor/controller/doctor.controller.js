import RequestResult from '../../RequestResult';
import { STATUSES } from '../../../constants';

class DoctorController {
  constructor(doctorServices) {
    this.doctorServices = doctorServices;
  }

  async getAllSpecialization() {
    const res = new RequestResult();
    try {
      res.setValue = await this.doctorServices.getAllSpecializations();
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async allDoctorsBySpecializations(typeID) {
    const res = new RequestResult();
    try {
      res.setValue = await this.doctorServices.allDoctorsBySpecializations(typeID);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { DoctorController };
