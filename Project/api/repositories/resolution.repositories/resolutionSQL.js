import { NOT_AVAILABLE } from '../../../constants.js';

export default class ResolutionSQL {
  constructor(resolution) {
    this.resolutionModel = resolution;
  }

  async create(patient, resolutionValue, time) {
    const result = await this.resolutionModel.create({
      value: resolutionValue,
      delay: time,
      patient_id: patient.id,
    });
    console.log('create resolution with value :', result.value);
    return result;
  }

  async update(resolution, resolutionValue, time) {
    await this.resolutionModel.update({
      value: resolutionValue,
      delay: time,
      createdTime: new Date().getTime(),
    }, {
      where: {
        id: resolution.id,
      },
    });
  }

  async get(patient) {
    const result = await this.resolutionModel.findOne({
      where: {
        patient_id: patient.id,
      },
    });
    if (!result) {
      return '';
    }
    if (new Date().getTime() - new Date(result.updatedAt).getTime() > result.delay) {
      result.value = NOT_AVAILABLE;
    }
    console.log('find resolution with name :', result.value);
    return result;
  }

  async delete(resolution) {
    await this.resolutionModel.update({
      value: NOT_AVAILABLE,
      delay: null,
    }, {
      where: {
        id: resolution.id,
      },
    });
  }

  async getAll() {
    const rows = await this.resolutionModel.findAll({
      attributes: ['id'],
    });
    const result = rows.map((r) => r.dataValues.id);
    console.log('find all resolutions with ids :', result);
    return result;
  }
}
