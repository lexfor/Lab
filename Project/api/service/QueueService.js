export default class QueueService {
  constructor(queueRepository, patientService) {
    this.queueRepository = queueRepository;
    this.patientService = patientService;
  }

  async push(value) {
    const patient = await this.patientService.createPatient(value);
    await this.queueRepository.push(patient);
    return 'pushed';
  }

  async shift() {
    await this.queueRepository.shift();
    return 'shifted';
  }

  async getCurrent() {
    const patientID = await this.queueRepository.getFirst();
    const patient = await this.patientService.getPatient(patientID);
    return patient.name;
  }

  async isExist(value) {
    const allPatientInQueue = await this.queueRepository.getAll();
    let names = allPatientInQueue.map((item) => {
      const res = this.patientService.getPatient(item);
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
