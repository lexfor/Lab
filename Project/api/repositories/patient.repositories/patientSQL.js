export default class PatientSQL {
  constructor(patient) {
    this.patientModel = patient;
  }

  async create(patientName) {
    const result = await this.patientModel.create({ name: patientName });
    console.log('create patient with name :', result.name);
    return result;
  }

  async update(patient, value) {
    const result = await this.patientModel.update({
      name: value,
    }, {
      where: {
        id: patient.id,
      },
    });
    return result;
  }

  async getByName(patientName) {
    const result = await this.patientModel.findOne({
      where: {
        name: patientName,
      },
    });
    console.log('find patient with name :', result.name);
    return result;
  }

  async getByID(patientID) {
    const result = await this.patientModel.findOne({
      where: {
        id: patientID,
      },
    });
    console.log('return patient with name :', result.name);
    return result;
  }

  async delete(patient) {
    await this.patientModel.destroy({
      where: {
        id: patient.id,
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
