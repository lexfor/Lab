import RequestResult from '../RequestResult.js';
import { checkOutputStatus } from '../helpers/StatusHelper.js';
import { STATUSES, NOT_AVAILABLE } from '../../constants.js';

export default class QueueController {
  constructor(queue) {
    this.queueService = queue;
  }

  async checkLength() {
    const res = new RequestResult();
    if (await this.queueService.isEmpty()) {
      res.setValue = NOT_AVAILABLE;
      res.setStatus = STATUSES.UNAVAILABLE;
    }
    return res;
  }

  async checkIsExistValue(body) {
    const res = new RequestResult();
    if (await this.queueService.isExist(body)) {
      res.setValue = NOT_AVAILABLE;
      res.setStatus = STATUSES.BAD_REQUEST;
    }
    return res;
  }

  async addValueInQueue(body) {
    const res = await this.checkIsExistValue(body);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
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
    res.setValue = await this.queueService.shift();
    return checkOutputStatus(res);
  }
}
