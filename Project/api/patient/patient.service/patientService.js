import { NOT_AVAILABLE } from '../../../constants.js';

export default class PatientService {
  constructor(patientRepository, resolutionRepository) {
    this.patientRepository = patientRepository;
    this.resolutionRepository = resolutionRepository;
  }

  async getResolution(patientID) {
    const resolution = await this.resolutionRepository.get(patientID);
    if (!resolution.value) {
      return NOT_AVAILABLE;
    }
    return resolution;
  }

  async addPatientResolution(value, patientID, time) {
    const resolution = await this.resolutionRepository.create(patientID, value, time);
    return resolution;
  }

  async findPatientResolution(patient) {
    let patientID;
    if (patient.name) {
      patientID = await this.patientRepository.getByName(patient.name);
    } else {
      patientID = patient.id;
    }
    return this.getResolution(patientID);
  }

  async deletePatientResolution(patientID) {
    await this.resolutionRepository.delete(patientID);
    return { id: patientID };
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
