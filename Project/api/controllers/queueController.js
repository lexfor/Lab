import RequestResult from '../RequestResult.js';
import { checkOutputStatus } from '../helpers/StatusHelper.js';
import { STATUSES, NOT_AVAILABLE } from '../../constants.js';

export default class QueueController {
  constructor(queue, patient) {
    this.queueService = queue;
    this.patientService = patient;
  }

  async checkLength() {
    const res = new RequestResult();
    if (await this.queueService.isEmpty()) {
      res.setValue = NOT_AVAILABLE;
      res.setStatus = STATUSES.UNAVAILABLE;
    }
    return res;
  }

  async checkIsExistPatient(patientName) {
    const res = new RequestResult();
    if (await this.patientService.isExist(patientName)) {
      res.setValue = NOT_AVAILABLE;
      res.setStatus = STATUSES.BAD_REQUEST;
    }
    return res;
  }

  async addValueInQueue(patientName) {
    const res = await this.checkIsExistPatient(patientName);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    const result = await this.queueService.push(patientName);
    res.setValue = result.name;
    return checkOutputStatus(res);
  }

  async getCurrentInQueue() {
    const res = await this.checkLength();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    const result = await this.queueService.getCurrent();
    res.setValue = result.name;
    return checkOutputStatus(res);
  }

  async takeNextValueInQueue() {
    const res = await this.checkLength();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    const result = await this.queueService.shift();
    res.setValue = result.id;
    return checkOutputStatus(res);
  }
}
