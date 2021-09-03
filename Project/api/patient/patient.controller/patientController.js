import RequestResult from '../../RequestResult.js';
import { checkOutputStatus } from '../../helpers/StatusHelper.js';
import { STATUSES, NOT_AVAILABLE } from '../../../constants.js';

export default class PatientController {
  constructor(queue, patients) {
    this.queueService = queue;
    this.patientsService = patients;
  }

  async checkIsExistPatient(patient) {
    const res = new RequestResult();
    if (!await this.patientsService.isExist(patient)) {
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

  async setResolution(resolutionValue, patientID, delay = process.env.TTL_DELAY) {
    const res = await this.checkCurrentPatient();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.patientsService.addPatientResolution(
      resolutionValue,
      patientID,
      delay,
    );
    return checkOutputStatus(res);
  }

  async findResolution(patient) {
    const res = await this.checkIsExistPatient(patient);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.patientsService.findPatientResolution(patient);
    return checkOutputStatus(res);
  }

  async deletePatientResolution(patientID) {
    const res = await this.checkIsExistPatient({ id: patientID });
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.patientsService.deletePatientResolution(patientID);
    return checkOutputStatus(res);
  }
}
