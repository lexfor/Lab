export default class QueueService {
  constructor(queueRepository, patientRepository) {
    this.queueRepository = queueRepository;
    this.patientRepository = patientRepository;
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
    const patient = await this.patientRepository.getByID(patientID);
    return patient;
  }

  async isExist(value) {
    const allPatientIDInQueue = await this.queueRepository.getAll();
    let names = allPatientIDInQueue.map((patientID) => {
      const res = this.patientRepository.getByID(patientID);
      return res.name;
    });
    names = await Promise.all(names);
    return names.indexOf(value) !== -1;
  }

  async isEmpty() {
    const allPatientInQueue = await this.queueRepository.getAll();
    return allPatientInQueue.length === 0;
  }
}
