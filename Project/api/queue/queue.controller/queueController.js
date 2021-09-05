import RequestResult from '../../RequestResult.js';
import { checkOutputStatus } from '../../helpers/StatusHelper.js';
import { STATUSES, NOT_AVAILABLE } from '../../../constants.js';

export default class QueueController {
  constructor(queueService, patientService) {
    this.queueService = queueService;
    this.patientService = patientService;
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

  async addValueInQueue(userID) {
    const patient = await this.patientService.findPatientByUser(userID);
    const res = await this.checkIsPatientInQueue(patient.id);
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.queueService.push(patient.id);
    return checkOutputStatus(res);
  }

  async getCurrentInQueue() {
    const res = await this.checkLength();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    const patientID = await this.queueService.getCurrent();
    res.setValue = await this.patientService.findPatientByID(patientID);
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
