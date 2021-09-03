import { NOT_AVAILABLE } from '../../../constants.js';

export default class PatientService {
  constructor(patientRepository, resolutionRepository) {
    this.patientRepository = patientRepository;
    this.resolutionRepository = resolutionRepository;
  }

  async getResolution(patient) {
    const resolution = await this.resolutionRepository.get(patient);
    if (!resolution.value) {
      return NOT_AVAILABLE;
    }
    return resolution;
  }

  async addPatientResolution(value, patientID, time) {
    const patient = await this.patientRepository.getByID(patientID);
    const resolution = await this.resolutionRepository.create(patient, value, time);
    return resolution;
  }

  async findPatientResolution(patient) {
    let patientInfo;
    if (patient.name) {
      patientInfo = await this.patientRepository.getByName(patient.name);
    } else {
      patientInfo = await this.patientRepository.getByID(patient.id);
    }
    return this.getResolution(patientInfo);
  }

  async deletePatientResolution(patientID) {
    const patient = await this.patientRepository.getByID(patientID);
    const resolution = await this.resolutionRepository.get(patient);
    await this.resolutionRepository.delete(resolution);
    return resolution;
  }

  async isExist(patient) {
    if (patient.name) {
      const values = await this.patientRepository.getAllNames();
      return values.indexOf(patient.name) !== -1;
    }
    const values = await this.patientRepository.getAllIDs();
    return values.indexOf(patient.id) !== -1;
  }

  async isEmpty() {
    const result = await this.patientRepository.getAllNames();
    return result.length === 0;
  }
}
