import RequestResult from '../RequestResult.js';
import { checkOutputStatus } from '../helpers/StatusHelper.js';
import { STATUSES } from '../constants.js';

export default class QueueController {
  constructor(queue, patients) {
    this.queueService = queue;
    this.patientsService = patients;
  }

  async checkLength() {
    const res = new RequestResult();
    if (await this.queueService.isEmpty()) {
      res.setValue = 'N/A';
      res.setStatus = STATUSES.Unavailable;
    }
    return res;
  }

  async checkIsExistValue(body) {
    const res = new RequestResult();
    if (await this.queueService.isExist(body)) {
      res.setValue = 'N/A';
      res.setStatus = STATUSES.BadRequest;
    }
    return res;
  }

  async addValueInQueue(body) {
    const res = await this.checkIsExistValue(body);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    await this.patientsService.createResolution(body);
    res.setValue = await this.queueService.push(body);
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
    res.setValue = await this.queueService.pop();
    return checkOutputStatus(res);
  }
}
