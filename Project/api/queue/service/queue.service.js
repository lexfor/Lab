import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class QueueService {
  constructor(queueRepository) {
    this.queueRepository = queueRepository;
  }

  /**
   * Push patient in queue
   * @param {string} patientID
   * @param {string} doctorID
   * @returns {Promise<string>} patient ID
   */
  async pushPatient(patientID, doctorID) {
    const result = await this.queueRepository.pushPatient(patientID, doctorID);
    return result;
  }

  /**
   * Shift patient from queue
   * @param {string} doctorID
   * @returns {Promise<object>} prev patient ID
   */
  async shiftPatient(doctorID) {
    const result = await this.queueRepository.shiftPatient(doctorID);
    return result;
  }

  /**
   * Get current patient from queue
   * @param {string} doctorID
   * @returns {Promise<string>} current patient ID
   */
  async getCurrent(doctorID) {
    const patientID = await this.queueRepository.getFirst(doctorID);

    if (!patientID) {
      throw new ApiError('no patient in queue', STATUSES.NOT_FOUND);
    }
    return patientID;
  }

  /**
   * Check is patient already in queue
   * @param {string} value
   * @param {Promise<string>} doctorID
   */
  async isExist(value, doctorID) {
    const patientsIDs = await this.queueRepository.getAllPatient(doctorID);
    if (patientsIDs.indexOf(value) !== -1) {
      throw new ApiError('patient already in queue', STATUSES.CONFLICT);
    }
  }

  /**
   * Check is queue empty
   * @param {string} doctorID
   */
  async isEmpty(doctorID) {
    const allPatientInQueue = await this.queueRepository.getAllPatient(doctorID);
    if (allPatientInQueue.length === 0) {
      throw new ApiError('queue is empty', STATUSES.CONFLICT);
    }
  }
}

export { QueueService };
