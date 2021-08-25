import { NOT_AVAILABLE } from '../../constants.js';

export default class PatientService {
  constructor(patientRepository, resolutionRepository, queueRepository) {
    this.patientRepository = patientRepository;
    this.resolutionRepository = resolutionRepository;
    this.queueRepository = queueRepository;
  }

  async createPatient(value) {
    const patient = await this.patientRepository.create(value);
    return patient;
  }

  async addPatientResolution(value, time) {
    const patientID = await this.queueRepository.getFirst();
    const patient = await this.patientRepository.getByID(patientID);
    const resolution = await this.resolutionRepository.create(patient, value, time);
    return resolution.value;
  }

  async findPatientResolution(patientName) {
    const patient = await this.patientRepository.getByName(patientName);
    const resolution = await this.resolutionRepository.get(patient);
    if (!resolution.value) {
      return NOT_AVAILABLE;
    }
    return resolution.value;
  }

  async deletePatientResolution(patientName) {
    const patient = await this.patientRepository.getByName(patientName);
    const resolution = await this.resolutionRepository.get(patient);
    await this.resolutionRepository.delete(resolution);
    return resolution.value;
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
