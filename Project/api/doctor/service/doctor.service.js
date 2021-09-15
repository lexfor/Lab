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
    return result;
  }

  async getDoctorByID(userID) {
    const result = await this.doctorRepository.getDoctorByID(userID);
    return result;
  }
}
export { DoctorService };
