import { queue } from '../service/Queue.js';
import RequestResult from '../RequestResult.js';
import { checkOutputStatus } from '../helpers/StatusHelper.js';
import { STATUSES } from '../constants.js';

class QueueController {
  checkLength() {
    const res = new RequestResult();
    if (queue.fifo.length === 0) {
      res.setValue = 'N/A';
      res.setStatus = STATUSES.Unavailable;
    }
    return res;
  }

  checkIsExistValue(body) {
    const res = new RequestResult();
    if (queue.fifo.indexOf(body) !== -1) {
      res.setValue = 'N/A';
      res.setStatus = STATUSES.BadRequest;
    }
    return res;
  }

  addValueInQueue(body) {
    const res = this.checkIsExistValue(body);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = queue.Push(body);
    return checkOutputStatus(res);
  }

  getCurrentInQueue() {
    const res = this.checkLength();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = queue.Get();
    return checkOutputStatus(res);
  }

  takeNextPatient() {
    const res = this.checkLength();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = queue.Pop();
    return checkOutputStatus(res);
  }
}

const queueController = new QueueController();
export { queueController };
