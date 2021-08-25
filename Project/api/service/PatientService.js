export default class PatientService {
  constructor(patientRepository, resolutionService) {
    this.patientRepository = patientRepository;
    this.resolutionService = resolutionService;
  }

  async findResolution(value) {
    const patient = await this.patientRepository.find(value);
    const resolution = await this.resolutionService.findResolution(patient);
    if (!resolution.value) {
      return 'not found';
    }
    return resolution;
  }

  async createPatient(value) {
    const patient = await this.patientRepository.create(value);
    return patient;
  }

  async getPatient(patientID) {
    const result = await this.patientRepository.get(patientID);
    return result;
  }

  async addResolution(value, resolution, time) {
    const patient = await this.patientRepository.find(value);
    const resolutionResult = await this.resolutionService.addResolution(patient, resolution, time);
    return resolutionResult;
  }

  async getResolutionValue(value) {
    const result = await this.findResolution(value);
    if (!result.value) {
      return 'not found';
    }
    return result.value;
  }

  async deleteResolution(value) {
    const patient = await this.patientRepository.find(value);
    await this.resolutionService.deleteResolution(patient);
    return patient;
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
