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
      res.setStatus = STATUSES.Unavailable;
    }
    return res;
  }

  async checkIsExistPatient(body) {
    const res = new RequestResult();
    if (!await this.patientsService.isExist(body)) {
      res.setValue = NOT_AVAILABLE;
      res.setStatus = STATUSES.NotFound;
    }
    return res;
  }

  async checkCurrentPatient() {
    const res = new RequestResult();
    if (await this.queueService.isEmpty()) {
      res.setValue = NOT_AVAILABLE;
      res.setStatus = STATUSES.Unavailable;
    }
    return res;
  }

  async setResolutionForCurrentPatient(body) {
    const res = await this.checkCurrentPatient();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    let delay;
    if (body.delay) {
      delay = body.delay;
    } else {
      delay = process.env.TTL_DELAY;
    }
    res.setValue = await this.patientsService.addResolution(
      await this.queueService.getCurrent(),
      body.value,
      delay,
    );
    return checkOutputStatus(res);
  }

  async getAllProcessedPatientsNames() {
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
    res.setValue = await this.patientsService.getResolution(body);
    return checkOutputStatus(res);
  }

  async deletePatientResolution(body) {
    const res = await this.checkIsExistPatient(body);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.patientsService.deleteResolution(body);
    return checkOutputStatus(res);
  }
}
