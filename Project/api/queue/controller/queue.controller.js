import RequestResult from '../../RequestResult';
import { STATUSES } from '../../../constants';

class QueueController {
  constructor(queueService, patientService, doctorService) {
    this.queueService = queueService;
    this.patientService = patientService;
    this.doctorService = doctorService;
  }

  async addValueInQueue(userID, doctorID) {
    const res = new RequestResult();
    try {
      const patient = await this.patientService.findPatientByUser(userID);
      await this.queueService.isExist(patient.id, doctorID);
      res.setValue = await this.queueService.push(patient.id, doctorID);
      res.setStatus = STATUSES.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async getCurrentInQueue(doctorID) {
    const res = new RequestResult();
    try {
      await this.queueService.isEmpty(doctorID);
      const patientID = await this.queueService.getCurrent(doctorID);
      res.setValue = await this.patientService.findPatientByID(patientID);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async getCurrentInMyQueue(userID) {
    const res = new RequestResult();
    try {
      const doctor = await this.doctorService.getDoctorByID(userID);
      await this.queueService.isEmpty(doctor.doctor_id);
      const patientID = await this.queueService.getCurrent(doctor.doctor_id);
      res.setValue = await this.patientService.findPatientByID(patientID);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async takeNextValueInQueue(userID) {
    const res = new RequestResult();
    try {
      const doctor = await this.doctorService.getDoctorByID(userID);
      await this.queueService.isEmpty(doctor.doctor_id);
      res.setValue = await this.queueService.shift(doctor.doctor_id);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { QueueController };
