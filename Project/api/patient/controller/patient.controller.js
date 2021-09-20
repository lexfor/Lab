import RequestResult from '../../helpers/RequestResult';
import { STATUSES } from '../../../constants';

class PatientController {
  constructor(patientService) {
    this.patientService = patientService;
  }

  /**
   * Get all patients
   * @param {object} patient
   * @returns {object} all founded patients with condition and status
   */
  async findAllPatients({ patientInfo }) {
    const res = new RequestResult();
    try {
      res.setValue = await this.patientService.getAllPatients(patientInfo);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { PatientController };
