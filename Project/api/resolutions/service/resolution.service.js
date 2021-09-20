import { STATUSES } from '../../../constants';
import ApiError from '../../helpers/ApiError';

class ResolutionService {
  constructor(resolutionRepository) {
    this.resolutionRepository = resolutionRepository;
  }

  /**
   * Get all patient resolutions
   * @param {string} patientID
   * @returns {array} patient resolution data array
   */
  async getAllResolutions(patientID) {
    const resolutions = await this.resolutionRepository.getAllResolutions(patientID);
    if (!resolutions) {
      throw new ApiError('no resolutions', STATUSES.NOT_FOUND);
    }

    return resolutions;
  }

  /**
   * Create new resolution for patient
   * @param {object} data
   * @returns {object} resolution data
   */
  async addResolution(data) {
    const resolution = await this.resolutionRepository.create(data);
    return resolution;
  }

  /**
   * Delete resolution
   * @param {string} resolutionID
   * @returns {object} resolution data
   */
  async deleteResolution(resolutionID) {
    const result = await this.resolutionRepository.delete(resolutionID);
    return result;
  }
}

export { ResolutionService };
