import RequestResult from '../../RequestResult';
import { STATUSES } from '../../../constants';

class PatientController {
  constructor(queueService, patientService) {
    this.queueService = queueService;
    this.patientService = patientService;
  }

  async addValueInQueue(userID, doctorName, doctorType) {
    const res = new RequestResult();
    try {
      const patient = await this.patientService.findPatientByUser(userID);
      await this.queueService.isExist(patient.id, doctorName, doctorType);
      res.setValue = await this.queueService.push(patient.id, doctorName, doctorType);
      res.setStatus = STATUSES.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async getCurrentInQueue(doctorName, doctorType) {
    const res = new RequestResult();
    try {
      const patientID = await this.queueService.getCurrent(doctorName, doctorType);
      res.setValue = await this.patientService.findPatientByID(patientID);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async takeNextValueInQueue(doctorName, doctorType) {
    const res = new RequestResult();
    try {
      await this.queueService.isEmpty(doctorName, doctorType);
      res.setValue = await this.queueService.shift(doctorName, doctorType);
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
