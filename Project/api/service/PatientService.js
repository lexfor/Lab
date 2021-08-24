export default class PatientService {
  constructor(patientStorage, resolutionStorage) {
    this.patientStorage = patientStorage;
    this.resolutionStorage = resolutionStorage;
  }

  async findResolutionID(value) {
    const patientID = await this.patientStorage.find(value);
    const resolutionID = await this.resolutionStorage.getResolutionID(patientID);
    return resolutionID;
  }

  async createPatient(value) {
    const patientID = await this.patientStorage.create(value);
    return patientID;
  }

  async getPatientName(patientID) {
    const result = await this.patientStorage.get(patientID);
    return result;
  }

  async addResolution(value, resolution, time) {
    const patientID = await this.patientStorage.find(value);
    await this.resolutionStorage.create(patientID, resolution, time);
    return 'updated';
  }

  async getResolution(value) {
    const resolutionID = await this.findResolutionID(value);
    const res = await this.resolutionStorage.get(resolutionID);
    if (res) {
      return res;
    }
    return 'not found';
  }

  async deleteResolution(value) {
    const resolutionID = await this.findResolutionID(value);
    await this.resolutionStorage.delete(resolutionID);
    return 'deleted';
  }

  async getAllPatientNames() {
    const result = await this.patientStorage.getAllNames();
    return result;
  }

  async isExist(value) {
    const values = await this.patientStorage.getAllNames();
    return values.indexOf(value) !== -1;
  }

  async isEmpty() {
    const result = await this.patientStorage.getAllNames();
    return result.length === 0;
  }
}
