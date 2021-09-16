import RequestResult from '../../RequestResult';
import { STATUSES } from '../../../constants';

class PatientController {
  constructor(patientService) {
    this.patientService = patientService;
  }

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
