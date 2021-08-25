export default class PatientSQL {
  constructor(patient) {
    this.patientModel = patient;
  }

  async create(value) {
    const result = await this.patientModel.create({ name: value });
    console.log('create patient with name :', result.name);
    return result;
  }

  async update(patientObject, value) {
    const result = await this.patientModel.update({
      name: value,
    }, {
      where: {
        id: patientObject.id,
      },
    });
    return result;
  }

  async find(patientName) {
    const result = await this.patientModel.findOne({
      where: {
        name: patientName,
      },
    });
    console.log('find patient with name :', result.name);
    return result;
  }

  async get(patientID) {
    const result = await this.patientModel.findOne({
      where: {
        id: patientID,
      },
    });
    console.log('return patient with name :', result.name);
    return result;
  }

  async delete(patientObject) {
    await this.patientModel.destroy({
      where: {
        id: patientObject.id,
      },
    });
  }

  async getAllNames() {
    const rows = await this.patientModel.findAll({
      attributes: ['name'],
    });
    const result = rows.map((r) => r.dataValues.name);
    console.log('find all patient with names :', result);
    return result;
  }
}
