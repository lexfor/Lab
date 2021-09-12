import { STATUSES } from '../../../constants';
import ApiError from '../../helpers/ApiError';

class ResolutionService {
  constructor(resolutionRepository) {
    this.resolutionRepository = resolutionRepository;
  }

  async getResolution(patientID) {
    const resolution = await this.resolutionRepository.get(patientID);
    if (!resolution.value) {
      throw new ApiError('no resolutions', STATUSES.NOT_FOUND);
    }
    const result = { value: resolution.value, patient_id: patientID };
    return result;
  }

  async getAllResolutions(patientID) {
    const resolutions = await this.resolutionRepository.getAllResolutions(patientID);
    if (!resolutions) {
      throw new ApiError('no resolutions', STATUSES.NOT_FOUND);
    }

    return resolutions;
  }

  async addResolution(data) {
    const resolution = await this.resolutionRepository.create(data);
    return resolution;
  }

  async deleteResolution(patientID) {
    const result = await this.resolutionRepository.delete(patientID);
    return result;
  }

  async isExist(patientID) {
    const result = await this.resolutionRepository.get(patientID);
    if (!result.value) {
      throw new ApiError('no such resolutions', STATUSES.NOT_FOUND);
    }
  }
}

export { ResolutionService };
