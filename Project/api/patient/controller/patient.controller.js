import RequestResult from '../../RequestResult';
import { STATUSES } from '../../../constants';

class PatientController {
  constructor(queueService, patientService) {
    this.queueService = queueService;
    this.patientService = patientService;
  }

  async addValueInQueue(userID) {
    const res = new RequestResult();
    try {
      const patient = await this.patientService.findPatientByUser(userID);
      await this.queueService.isExist(patient.id);
      res.setValue = await this.queueService.push(patient.id);
      res.setStatus = STATUSES.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async getCurrentInQueue() {
    const res = new RequestResult();
    try {
      const patientID = await this.queueService.getCurrent();
      res.setValue = await this.patientService.findPatientByID(patientID);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async takeNextValueInQueue() {
    const res = new RequestResult();
    try {
      await this.queueService.isEmpty();
      res.setValue = await this.queueService.shift();
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
