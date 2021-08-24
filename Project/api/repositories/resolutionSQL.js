import { resolution } from '../models/Model.js';
import { NOT_AVAILABLE } from '../../constants.js';

class ResolutionSQL {
  async create(patientID, resolutionValue, time) {
    let result = await resolution.create({
      value: resolutionValue,
      delay: time,
      createdTime: new Date().getTime(),
      patient_id: patientID,
    });
    console.log('create resolution with value :', result.value);
    result = result.id;
    return result;
  }

  async update(resolutionID, resolutionValue, time) {
    await resolution.update({
      value: resolutionValue,
      delay: time,
      createdTime: new Date().getTime(),
    }, {
      where: {
        id: resolutionID,
      },
    });
  }

  async getResolutionID(patientID) {
    let result = await resolution.findOne({
      where: {
        patient_id: patientID,
      },
    });
    console.log('find resolution with name :', result.name);
    result = result.id;
    return result;
  }

  async get(resolutionID) {
    let result = await resolution.findOne({
      where: {
        id: resolutionID,
      },
    });
    if (new Date().getTime() - result.createdTime >= result.delay) {
      return NOT_AVAILABLE;
    }
    console.log('find resolution :', result.value);
    result = result.value;
    return result;
  }

  async delete(resolutionID) {
    await resolution.update({
      value: NOT_AVAILABLE,
      delay: null,
    }, {
      where: {
        id: resolutionID,
      },
    });
  }

  async getAll() {
    const rows = await resolution.findAll({
      attributes: ['id'],
    });
    const result = rows.map((r) => r.dataValues.id);
    console.log('find all resolutions with ids :', result);
    return result;
  }
}

const resolutionInSQL = new ResolutionSQL();
export { resolutionInSQL };
