import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class DoctorService {
  constructor(doctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  async getAllSpecializations() {
    const result = await this.doctorRepository.getAllSpecializations();
    return result;
  }

  async allDoctorsBySpecializations(specializationsID) {
    const result = await this.doctorRepository.allDoctorsBySpecializations(specializationsID);
    if (!result) {
      throw new ApiError('no doctors with that specialization', STATUSES.NOT_FOUND);
    }
    return result;
  }

  async getDoctorByID(userID) {
    const result = await this.doctorRepository.getDoctorByID(userID);
    if (!result) {
      throw new ApiError('no such doctor', STATUSES.NOT_FOUND);
    }
    return result;
  }
}
export { DoctorService };
