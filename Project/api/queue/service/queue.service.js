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
    return patientID;
  }

  async isExist(value) {
    const patientsIDs = await this.queueRepository.getAll();
    return patientsIDs.indexOf(value) !== -1;
  }

  async isEmpty() {
    const allPatientInQueue = await this.queueRepository.getAll();
    return allPatientInQueue.length === 0;
  }
}

export { QueueService };
