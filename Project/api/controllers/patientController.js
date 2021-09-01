import RequestResult from '../RequestResult.js';
import { checkOutputStatus } from '../helpers/StatusHelper.js';
import { STATUSES, NOT_AVAILABLE } from '../../constants.js';

export default class PatientController {
  constructor(queue, patients) {
    this.queueService = queue;
    this.patientsService = patients;
  }

  async checkIsExistPatient(patientName) {
    const res = new RequestResult();
    if (!await this.patientsService.isExist(patientName)) {
      res.setValue = { value: NOT_AVAILABLE };
      res.setStatus = STATUSES.NOT_FOUND;
    }
    return res;
  }

  async checkCurrentPatient() {
    const res = new RequestResult();
    if (await this.queueService.isEmpty()) {
      res.setValue = { value: NOT_AVAILABLE };
      res.setStatus = STATUSES.UNAVAILABLE;
    }
    return res;
  }

  async setResolutionForCurrentPatient(resolutionValue, delay = process.env.TTL_DELAY) {
    const res = await this.checkCurrentPatient();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.patientsService.addPatientResolution(resolutionValue, delay);
    return checkOutputStatus(res);
  }

  async findResolutionByPatientName(patientName) {
    const res = await this.checkIsExistPatient(patientName);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.patientsService.findPatientResolution(patientName);
    return checkOutputStatus(res);
  }

  async deletePatientResolution(patientName) {
    const res = await this.checkIsExistPatient(patientName);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.patientsService.deletePatientResolution(patientName);
    return checkOutputStatus(res);
  }
}
