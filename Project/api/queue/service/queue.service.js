import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class QueueService {
  constructor(queueRepository) {
    this.queueRepository = queueRepository;
  }

  async push(patientID, doctorName, doctorType) {
    const result = await this.queueRepository.push(patientID, doctorName, doctorType);
    return result;
  }

  async shift(doctorName, doctorType) {
    const result = await this.queueRepository.shift(doctorName, doctorType);
    return result;
  }

  async getCurrent(doctorName, doctorType) {
    const patientID = await this.queueRepository.getFirst(doctorName, doctorType);

    if (!patientID) {
      throw new ApiError('no patient in queue', STATUSES.NOT_FOUND);
    }
    return patientID;
  }

  async isExist(value, doctorName, doctorType) {
    const patientsIDs = await this.queueRepository.getAll(doctorName, doctorType);
    if (patientsIDs.indexOf(value) !== -1) {
      throw new ApiError('patient already in queue', STATUSES.CONFLICT);
    }
  }

  async isEmpty(doctorName, doctorType) {
    const allPatientInQueue = await this.queueRepository.getAll(doctorName, doctorType);
    if (allPatientInQueue.length === 0) {
      throw new ApiError('queue is empty', STATUSES.CONFLICT);
    }
  }
}

export { QueueService };
