import RequestResult from '../../helpers/RequestResult';
import { STATUSES } from '../../../constants';

class DoctorController {
  constructor(doctorServices) {
    this.doctorServices = doctorServices;
  }

  /**
   * Get all doctors specializations
   * @returns {Promise<object>} all specializations and status
   */
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

  /**
   * Get all doctors for specialization
   * @param {string} specializationID
   * @returns {Promise<object>} doctors and status
   */
  async getAllDoctorsBySpecializations(specializationID) {
    const res = new RequestResult();
    try {
      res.setValue = await this.doctorServices.getAllDoctorsBySpecializations(specializationID);
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
