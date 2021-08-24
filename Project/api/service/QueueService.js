export default class QueueService {
  constructor(queueStorage, patientService) {
    this.queueStorage = queueStorage;
    this.patientService = patientService;
  }

  async push(value) {
    const patientID = await this.patientService.createPatient(value);
    await this.queueStorage.push(patientID);
    return 'pushed';
  }

  async shift() {
    await this.queueStorage.shift();
    return 'shifted';
  }

  async getCurrent() {
    const patientID = await this.queueStorage.getFirst();
    const name = await this.patientService.getPatientName(patientID);
    return name;
  }

  async isExist(value) {
    const allPatientInQueue = await this.queueStorage.getAll();
    let names = allPatientInQueue.map((item) => {
      const res = this.patientService.getPatientName(item);
      return res;
    });
    names = await Promise.all(names);
    return names.indexOf(value) !== -1;
  }

  async isEmpty() {
    const allPatientInQueue = await this.queueStorage.getAll();
    return allPatientInQueue.length === 0;
  }
}
