export default class ResolutionService {
  constructor(resolutionRepository) {
    this.resolutionRepository = resolutionRepository;
  }

  async findResolution(patient) {
    const resolution = await this.resolutionRepository.getResolution(patient);
    return resolution;
  }

  async addResolution(patient, resolution, time) {
    const resolutionResult = await this.resolutionRepository.create(patient, resolution, time);
    return resolutionResult;
  }

  async deleteResolution(patient) {
    console.log(patient);
    const resolution = await this.findResolution(patient);
    await this.resolutionRepository.delete(resolution);
    return resolution;
  }
}
