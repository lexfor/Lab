import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class DoctorService {
  constructor(doctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  /**
   * Get all doctors specializations
   * @returns {array} array of specializations
   */
  async getAllSpecializations() {
    const result = await this.doctorRepository.getAllSpecializations();
    return result;
  }

  /**
   * Get all doctors by specialization
   * @param {string} specializationsID
   * @returns {array} array of doctors
   */
  async allDoctorsBySpecializations(specializationsID) {
    const result = await this.doctorRepository.allDoctorsBySpecializations(specializationsID);
    if (!result) {
      throw new ApiError('no doctors with that specialization', STATUSES.NOT_FOUND);
    }
    return result;
  }

  /**
   * Get doctor by ID
   * @param {string} userID
   * @returns {object} founded doctor
   */
  async getDoctorByID(userID) {
    const result = await this.doctorRepository.getDoctorByID(userID);
    if (!result) {
      throw new ApiError('no such doctor', STATUSES.NOT_FOUND);
    }
    return result;
  }
}
export { DoctorService };
