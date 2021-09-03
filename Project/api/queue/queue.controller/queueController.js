import RequestResult from '../../RequestResult.js';
import { checkOutputStatus } from '../../helpers/StatusHelper.js';
import { STATUSES, NOT_AVAILABLE } from '../../../constants.js';

export default class QueueController {
  constructor(queue) {
    this.queueService = queue;
  }

  async checkIsPatientInQueue(patientID) {
    const res = new RequestResult();
    if (await this.queueService.isExist(patientID)) {
      res.setValue = { name: NOT_AVAILABLE };
      res.setStatus = STATUSES.UNAVAILABLE;
    }
    return res;
  }

  async checkLength() {
    const res = new RequestResult();
    if (await this.queueService.isEmpty()) {
      res.setValue = { name: NOT_AVAILABLE };
      res.setStatus = STATUSES.UNAVAILABLE;
    }
    return res;
  }

  async addValueInQueue(patientID) {
    const res = await this.checkIsPatientInQueue();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.queueService.push(patientID);
    return checkOutputStatus(res);
  }

  async getCurrentInQueue() {
    const res = await this.checkLength();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.queueService.getCurrent();
    return checkOutputStatus(res);
  }

  async takeNextValueInQueue() {
    const res = await this.checkLength();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.queueService.shift();
    return checkOutputStatus(res);
  }
}
