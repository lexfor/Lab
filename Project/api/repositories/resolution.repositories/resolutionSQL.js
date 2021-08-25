import { NOT_AVAILABLE } from '../../../constants.js';

export default class ResolutionSQL {
  constructor(resolution) {
    this.resolutionModel = resolution;
  }

  async create(patientObject, resolutionValue, time) {
    const result = await this.resolutionModel.create({
      value: resolutionValue,
      delay: time,
      patient_id: patientObject.id,
    });
    console.log('create resolution with value :', result.value);
    return result;
  }

  async update(resolutionObject, resolutionValue, time) {
    await this.resolutionModel.update({
      value: resolutionValue,
      delay: time,
      createdTime: new Date().getTime(),
    }, {
      where: {
        id: resolutionObject.id,
      },
    });
  }

  async getResolution(patientObject) {
    const result = await this.resolutionModel.findOne({
      where: {
        patient_id: patientObject.id,
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

  async get(resolutionObject) {
    const result = await this.resolutionModel.findOne({
      where: {
        id: resolutionObject.id,
      },
    });
    if (!result) {
      return '';
    }
    console.log('find resolution :', result.value);
    return result;
  }

  async delete(resolutionObject) {
    await this.resolutionModel.update({
      value: NOT_AVAILABLE,
      delay: null,
    }, {
      where: {
        id: resolutionObject.id,
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
