import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class QueueService {
  constructor(queueRepository) {
    this.queueRepository = queueRepository;
  }

  async push(patientID, doctorID) {
    const result = await this.queueRepository.push(patientID, doctorID);
    return result;
  }

  async shift(doctorID) {
    const result = await this.queueRepository.shift(doctorID);
    return result;
  }

  async getCurrent(doctorID) {
    const patientID = await this.queueRepository.getFirst(doctorID);

    if (!patientID) {
      throw new ApiError('no patient in queue', STATUSES.NOT_FOUND);
    }
    return patientID;
  }

  async isExist(value, doctorID) {
    const patientsIDs = await this.queueRepository.getAll(doctorID);
    if (patientsIDs.indexOf(value) !== -1) {
      throw new ApiError('patient already in queue', STATUSES.CONFLICT);
    }
  }

  async isEmpty(doctorID) {
    const allPatientInQueue = await this.queueRepository.getAll(doctorID);
    if (allPatientInQueue.length === 0) {
      throw new ApiError('queue is empty', STATUSES.CONFLICT);
    }
  }
}

export { QueueService };
