import { STATUSES } from '../../../constants';
import RequestResult from '../../RequestResult';

class ResolutionController {
  constructor(resolutionService, queueService, patientService) {
    this.resolutionService = resolutionService;
    this.queueService = queueService;
    this.patientService = patientService;
  }

  async setResolution(values, patient, doctor, TTLDelay = process.env.TTL_DELAY) {
    const res = new RequestResult();
    try {
      const data = { ...values, patient_id: patient.id, delay: TTLDelay };
      await this.queueService.isEmpty(doctor.firstName, doctor.specializationName);
      res.setValue = await this.resolutionService.addResolution(data);
      res.setStatus = STATUSES.CREATED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async findResolution({ userID }) {
    const res = new RequestResult();
    try {
      await this.patientService.isExist({ userID });
      const patientID = await this.patientService.findPatient({ userID });
      res.setValue = await this.resolutionService.getResolution(patientID);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async deletePatientResolution(patient) {
    const res = new RequestResult();
    try {
      await this.patientService.isExist(patient);
      await this.resolutionService.isExist(patient.id);
      res.setValue = await this.resolutionService.deleteResolution(patient.id);
      res.setStatus = STATUSES.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { ResolutionController };
