import { NOT_AVAILABLE } from '../../../constants.js';

export default class ResolutionService {
  constructor(resolutionRepository) {
    this.resolutionRepository = resolutionRepository;
  }

  async getResolution(patientID) {
    const resolution = await this.resolutionRepository.get(patientID);
    if (!resolution.value) {
      return { value: NOT_AVAILABLE };
    }
    const result = { value: resolution.value, patient_id: patientID };
    return result;
  }

  async addPatientResolution(value, patientID, time) {
    const resolution = await this.resolutionRepository.create(patientID, value, time);
    return resolution;
  }

  async deletePatientResolution(patientID) {
    const result = await this.resolutionRepository.delete(patientID);
    return result;
  }
}
