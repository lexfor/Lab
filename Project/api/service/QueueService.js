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

  async pop() {
    await this.queueStorage.shift();
    return 'shifted';
  }

  async getCurrent() {
    const patientID = await this.queueStorage.getFirst();
    const name = await this.patientService.getPatientName(patientID);
    return name;
  }

  async isExist(value) {
    const fifo = await this.queueStorage.getAll();
    let names = fifo.map((item) => {
      const res = this.patientService.getPatientName(item);
      return res;
    });
    names = await Promise.all(names);
    return names.indexOf(value) !== -1;
  }

  async isEmpty() {
    const fifo = await this.queueStorage.getAll();
    return fifo.length === 0;
  }
}
