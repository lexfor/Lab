export default class PatientService {
  constructor(patientRepository, resolutionRepository) {
    this.patientRepository = patientRepository;
    this.resolutionRepository = resolutionRepository;
  }

  async findResolutionID(value) {
    const patientID = await this.patientRepository.find(value);
    const resolutionID = await this.resolutionRepository.getResolutionID(patientID);
    return resolutionID;
  }

  async createPatient(value) {
    const patientID = await this.patientRepository.create(value);
    return patientID;
  }

  async getPatientName(patientID) {
    const result = await this.patientRepository.get(patientID);
    return result;
  }

  async addResolution(value, resolution, time) {
    const patientID = await this.patientRepository.find(value);
    await this.resolutionRepository.create(patientID, resolution, time);
    return 'updated';
  }

  async getResolution(value) {
    const resolutionID = await this.findResolutionID(value);
    const res = await this.resolutionRepository.get(resolutionID);
    if (res) {
      return res;
    }
    return 'not found';
  }

  async deleteResolution(value) {
    const resolutionID = await this.findResolutionID(value);
    await this.resolutionRepository.delete(resolutionID);
    return 'deleted';
  }

  async getAllPatientNames() {
    const result = await this.patientRepository.getAllNames();
    return result;
  }

  async isExist(value) {
    const values = await this.patientRepository.getAllNames();
    return values.indexOf(value) !== -1;
  }

  async isEmpty() {
    const result = await this.patientRepository.getAllNames();
    return result.length === 0;
  }
}
