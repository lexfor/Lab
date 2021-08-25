import { patient } from '../models/Model.js';

class PatientSQL {
  async create(value) {
    let result = await patient.create({ name: value });
    console.log('create patient with name :', result.name);
    result = result.id;
    return result;
  }

  async update(patientID, value) {
    await patient.update({
      name: value,
    }, {
      where: {
        id: patientID,
      },
    });
    return 'updated';
  }

  async find(patientName) {
    let result = await patient.findOne({
      where: {
        name: patientName,
      },
    });
    console.log('find patient with name :', result.name);
    result = result.id;
    return result;
  }

  async get(patientID) {
    let result = await patient.findOne({
      where: {
        id: patientID,
      },
    });
    console.log('return patient with name :', result.name);
    result = result.name;
    return result;
  }

  async delete(patientID) {
    await patient.destroy({
      where: {
        id: patientID,
      },
    });
  }

  async getAllNames() {
    const rows = await patient.findAll({
      attributes: ['name'],
    });
    const result = rows.map((r) => r.dataValues.name);
    console.log('find all patient with names :', result);
    return result;
  }
}

const patientSQLRepository = new PatientSQL();
export { patientSQLRepository };
