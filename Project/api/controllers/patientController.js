import RequestResult from '../RequestResult.js';
import { checkOutputStatus } from '../helpers/StatusHelper.js';
import { STATUSES, NOT_AVAILABLE } from '../../constants.js';

export default class PatientController {
  constructor(queue, patients) {
    this.queueService = queue;
    this.patientsService = patients;
  }

  async checkLength() {
    const res = new RequestResult();
    if (await this.patientsService.isEmpty()) {
      res.setValue = NOT_AVAILABLE;
      res.setStatus = STATUSES.UNAVAILABLE;
    }
    return res;
  }

  async checkIsExistPatient(patientName) {
    const res = new RequestResult();
    if (!await this.patientsService.isExist(patientName)) {
      res.setValue = NOT_AVAILABLE;
      res.setStatus = STATUSES.NOT_FOUND;
    }
    return res;
  }

  async checkCurrentPatient() {
    const res = new RequestResult();
    if (await this.queueService.isEmpty()) {
      res.setValue = NOT_AVAILABLE;
      res.setStatus = STATUSES.UNAVAILABLE;
    }
    return res;
  }

  async setResolutionForCurrentPatient(params) {
    const res = await this.checkCurrentPatient();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    let delay;
    if (params.delay) {
      delay = params.delay;
    } else {
      delay = process.env.TTL_DELAY;
    }
    res.setValue = await this.patientsService.addPatientResolution(params.value, delay);
    return checkOutputStatus(res);
  }

  async getAllPatientsNames() {
    const res = await this.checkLength();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.patientsService.getAllPatientNames();
    return checkOutputStatus(res);
  }

  async findResolutionByPatientName(body) {
    const res = await this.checkIsExistPatient(body);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.patientsService.findPatientResolution(body);
    return checkOutputStatus(res);
  }

  async deletePatientResolution(body) {
    const res = await this.checkIsExistPatient(body);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.patientsService.deletePatientResolution(body);
    return checkOutputStatus(res);
  }
}
