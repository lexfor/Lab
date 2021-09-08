import { NOT_AVAILABLE, STATUSES } from '../../../constants';
import { checkOutputStatus } from '../../helpers/StatusHelper';
import RequestResult from '../../RequestResult';

class ResolutionController {
  constructor(resolutionService, queueService, patientService) {
    this.resolutionService = resolutionService;
    this.queueService = queueService;
    this.patientService = patientService;
  }

  async checkCurrentPatientInQueue() {
    const res = new RequestResult();
    if (await this.queueService.isEmpty()) {
      res.setValue = { value: NOT_AVAILABLE };
      res.setStatus = STATUSES.CONFLICT;
    }
    return res;
  }

  async checkIsExistPatient(patient) {
    const res = new RequestResult();
    if (!await this.patientService.isExist(patient)) {
      res.setValue = { value: NOT_AVAILABLE };
      res.setStatus = STATUSES.NOT_FOUND;
    }
    return res;
  }

  async setResolution(resolutionValue, patientID, delay = process.env.TTL_DELAY) {
    const res = await this.checkCurrentPatientInQueue();
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.resolutionService.addResolution(
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
    const patientID = await this.patientService.findPatient(patient);
    res.setValue = await this.resolutionService.getResolution(patientID);
    return checkOutputStatus(res);
  }

  async deletePatientResolution(patientID) {
    const res = await this.checkIsExistPatient({ id: patientID });
    if (res.getStatus !== STATUSES.OK) {
      return res;
    }
    res.setValue = await this.resolutionService.deleteResolution(patientID);
    return checkOutputStatus(res);
  }
}

export { ResolutionController };
