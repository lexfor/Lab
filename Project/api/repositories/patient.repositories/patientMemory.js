import { v4 as uuidv4 } from 'uuid';

class PatientMemory {
  constructor() {
    this.patients = [];
  }

  async create(patientName) {
    const uuid = uuidv4();
    const patientObject = { id: uuid, name: patientName };
    this.patients.push(patientObject);
    return patientObject;
  }

  async update(patient, patientName) {
    this.patients.forEach((item, index) => {
      if (item.id === patient.id) {
        this.patients[index].name = patientName;
      }
    });
    return { id: patient.id, name: patientName };
  }

  async getByName(patientName) {
    let result = {};
    this.patients.forEach((item) => {
      if (item.name === patientName) {
        result = item;
      }
    });
    return result;
  }

  async getByID(patientID) {
    let result = {};
    this.patients.forEach((item) => {
      if (item.id === patientID) {
        result = item;
      }
    });
    return result;
  }

  async delete(patient) {
    let result;
    this.patients.forEach((item, index) => {
      if (item.id === patient.id) {
        result = index;
      }
    });
    this.patients.splice(result, 1);
    return result;
  }

  async getAllNames() {
    return this.patients.map((item) => item.name);
  }
}

const patientMemoryRepository = new PatientMemory();
export { patientMemoryRepository };
