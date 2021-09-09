import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class QueueService {
  constructor(queueRepository) {
    this.queueRepository = queueRepository;
  }

  async push(patientID) {
    const result = await this.queueRepository.push(patientID);
    return result;
  }

  async shift() {
    const result = await this.queueRepository.shift();
    return result;
  }

  async getCurrent() {
    const patientID = await this.queueRepository.getFirst();
    if (!patientID) {
      throw new ApiError('no patient in queue', STATUSES.NOT_FOUND);
    }
    return patientID;
  }

  async isExist(value) {
    const patientsIDs = await this.queueRepository.getAll();
    if (patientsIDs.indexOf(value) !== -1) {
      throw new ApiError('patient already in queue', STATUSES.CONFLICT);
    }
  }

  async isEmpty() {
    const allPatientInQueue = await this.queueRepository.getAll();
    if (allPatientInQueue.length === 0) {
      throw new ApiError('queue is empty', STATUSES.CONFLICT);
    }
  }
}

export { QueueService };
