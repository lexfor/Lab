import { STATUSES } from '../../../constants';
import RequestResult from '../../helpers/RequestResult';

class ResolutionController {
  constructor(resolutionService, queueService, patientService, doctorService) {
    this.resolutionService = resolutionService;
    this.queueService = queueService;
    this.patientService = patientService;
    this.doctorService = doctorService;
  }

  /**
   * Create new resolution
   * @param {object} values
   * @param {object} patient
   * @param {string} userID
   * @param {string} TTLDelay
   * @returns {Promise<object>} resolution data and status
   */
  async addResolution(values, patient, userID, TTLDelay = process.env.TTL_DELAY) {
    const res = new RequestResult();
    try {
      const doctor = await this.doctorService.getDoctorByID(userID);
      const data = {
        ...values,
        patient_id: patient.id,
        delay: TTLDelay,
        doctor_name: doctor.first_name,
        doctor_specialization: doctor.name,
      };
      await this.queueService.isEmpty(doctor.doctor_id);
      res.setValue = await this.resolutionService.addResolution(data);
      res.setStatus = STATUSES.CREATED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * find patient resolution by name or user ID
   * @param {string} userID
   * @returns {Promise<object>} resolution data and status
   */
  async getPatientResolutions(userID) {
    const res = new RequestResult();
    try {
      const patient = await this.patientService.getPatientByUser(userID);
      await this.patientService.isExist(patient.id);
      res.setValue = await this.resolutionService.getAllResolutions(patient.id);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Find all patient resolutions
   * @param {object} patientID
   * @returns {Promise<object>} resolution data and status
   */
  async getAllResolutions(patientID) {
    const res = new RequestResult();
    try {
      await this.patientService.isExist(patientID);
      res.setValue = await this.resolutionService.getAllResolutions(patientID);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Delete resolution by ID
   * @param {string} resolutionID
   * @returns {Promise<object>} resolution data and status
   */
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
