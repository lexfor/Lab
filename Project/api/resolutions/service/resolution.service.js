import { STATUSES } from '../../../constants';
import ApiError from '../../helpers/ApiError';

class ResolutionService {
  constructor(resolutionRepository) {
    this.resolutionRepository = resolutionRepository;
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

  async deleteResolution(resolutionID) {
    const result = await this.resolutionRepository.delete(resolutionID);
    return result;
  }
}

export { ResolutionService };
