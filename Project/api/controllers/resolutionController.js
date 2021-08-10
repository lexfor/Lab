import { patients } from '../service/ProcessedPatients.js';
import { queue } from '../service/Queue.js';
import RequestResult from '../RequestResult.js';
import { checkOutputStatus } from '../helpers/StatusHelper.js';
import { STATUSES } from '../constants.js';

class ResolutionController {
  checkLength() {
    const res = new RequestResult();
    if (patients.taken.size === 0) {
      res.setValue = 'N/A';
      res.setStatus = STATUSES.Unavailable;
    }
    return res;
  }

  checkIsExistResolution(body) {
    const res = new RequestResult();
    if (!patients.taken.has(body)) {
      res.setValue = 'N/A';
      res.setStatus = STATUSES.NotFound;
    }
    return res;
  }

  checkCurrentPatient() {
    const res = new RequestResult();
    if (queue.fifo.length === 0) {
      res.setValue = 'N/A';
      res.setStatus = STATUSES.Unavailable;
    }
    return res;
  }

  setResolutionForCurrentPatient(body) {
    const res = this.checkCurrentPatient();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = patients.Set(queue.Get(), body.value, body.time);
    return checkOutputStatus(res);
  }

  getAllProcessedPatientsValue() {
    const res = this.checkLength();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = patients.getAllValue();
    return checkOutputStatus(res);
  }

  findResolution(body) {
    const res = this.checkIsExistResolution(body);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = patients.Get(body);
    return checkOutputStatus(res);
  }

  deleteResolution(body) {
    const res = this.checkIsExistResolution(body);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = patients.Delete(body);
    return checkOutputStatus(res);
  }
}

const resolutionController = new ResolutionController();
export { resolutionController };
