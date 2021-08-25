export default class QueueService {
  constructor(queueRepository, patientService) {
    this.queueRepository = queueRepository;
    this.patientService = patientService;
  }

  async push(value) {
    const patientID = await this.patientService.createPatient(value);
    await this.queueRepository.push(patientID);
    return 'pushed';
  }

  async shift() {
    await this.queueRepository.shift();
    return 'shifted';
  }

  async getCurrent() {
    const patientID = await this.queueRepository.getFirst();
    const name = await this.patientService.getPatientName(patientID);
    return name;
  }

  async isExist(value) {
    const allPatientInQueue = await this.queueRepository.getAll();
    let names = allPatientInQueue.map((item) => {
      const res = this.patientService.getPatientName(item);
      return res;
    });
    names = await Promise.all(names);
    return names.indexOf(value) !== -1;
  }

  async isEmpty() {
    const allPatientInQueue = await this.queueRepository.getAll();
    return allPatientInQueue.length === 0;
  }
}
