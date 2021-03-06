import RequestResult from '../../helpers/RequestResult';
import { STATUSES } from '../../../constants';

class QueueController {
  constructor(queueService, patientService, doctorService) {
    this.queueService = queueService;
    this.patientService = patientService;
    this.doctorService = doctorService;
  }

  /**
   * Add patient ID in queue
   * @param {string} userID
   * @param {string} doctorID
   * @returns {Promise<object>} patient Data and status
   */
  async addValueInQueue(userID, doctorID) {
    const res = new RequestResult();
    try {
      const patient = await this.patientService.getPatientByUser(userID);
      await this.queueService.isExist(patient.id, doctorID);
      res.setValue = await this.queueService.pushPatient(patient.id, doctorID);
      res.setStatus = STATUSES.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Get current patient ID from queue
   * @param {string} doctorID
   * @returns {Promise<object>} patient data and status
   */
  async getCurrentInQueue(doctorID) {
    const res = new RequestResult();
    try {
      await this.queueService.isEmpty(doctorID);
      const patientID = await this.queueService.getCurrent(doctorID);
      res.setValue = await this.patientService.getPatientByID(patientID);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Get current patient by doctor ID
   * @param {string} userID
   * @returns {Promise<object>} patient data and status
   */
  async getCurrentInMyQueue(userID) {
    const res = new RequestResult();
    try {
      const doctor = await this.doctorService.getDoctorByID(userID);
      await this.queueService.isEmpty(doctor.doctor_id);
      const patientID = await this.queueService.getCurrent(doctor.doctor_id);
      res.setValue = await this.patientService.getPatientByID(patientID);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Take current patient and delete his from queue
   * @param {string} userID
   * @returns {Promise<object>} patient data and status
   */
  async takeNextValueInQueue(userID) {
    const res = new RequestResult();
    try {
      const doctor = await this.doctorService.getDoctorByID(userID);
      await this.queueService.isEmpty(doctor.doctor_id);
      res.setValue = await this.queueService.shiftPatient(doctor.doctor_id);
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
