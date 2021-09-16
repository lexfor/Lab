import { STATUSES } from '../../../constants';
import RequestResult from '../../RequestResult';

class ResolutionController {
  constructor(resolutionService, queueService, patientService, doctorService) {
    this.resolutionService = resolutionService;
    this.queueService = queueService;
    this.patientService = patientService;
    this.doctorService = doctorService;
  }

  async setResolution(values, patient, userID, TTLDelay = process.env.TTL_DELAY) {
    const res = new RequestResult();
    try {
      const doctor = await this.doctorService.getDoctorByID(userID);
      const data = {
        ...values,
        patient_id: patient.id,
        delay: TTLDelay,
        doctor_name: doctor.firstName,
        doctor_specialization: doctor.specializationName,
      };
      await this.queueService.isEmpty(doctor.doctorID);
      res.setValue = await this.resolutionService.addResolution(data);
      res.setStatus = STATUSES.CREATED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async findResolution(user) {
    const res = new RequestResult();
    try {
      await this.patientService.isExist(user);
      const patientID = await this.patientService.findPatient(user);
      res.setValue = await this.resolutionService.getAllResolutions(patientID);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async findAllResolutions({ patientID }) {
    const res = new RequestResult();
    try {
      await this.patientService.isExist({ id: patientID });
      res.setValue = await this.resolutionService.getAllResolutions(patientID);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  async deletePatientResolution(resolutionID) {
    const res = new RequestResult();
    try {
      res.setValue = await this.resolutionService.deleteResolution(resolutionID);
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
