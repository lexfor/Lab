export default class QueueService {
  constructor(queueRepository, patientRepository) {
    this.queueRepository = queueRepository;
    this.patientRepository = patientRepository;
  }

  async push(value) {
    const patient = await this.patientRepository.create(value);
    await this.queueRepository.push(patient);
    return 'pushed';
  }

  async shift() {
    await this.queueRepository.shift();
    return 'shifted';
  }

  async getCurrent() {
    const patientID = await this.queueRepository.getFirst();
    const patient = await this.patientRepository.getByID(patientID);
    return patient.name;
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
