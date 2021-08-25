import { v4 as uuidv4 } from 'uuid';

class PatientMemory {
  constructor() {
    this.patient = [];
  }

  async create(value) {
    const uuid = uuidv4();
    const patientObject = { id: uuid, name: value };
    this.patient.push(patientObject);
    return patientObject;
  }

  async update(patientObject, value) {
    this.patient.forEach((item, index) => {
      if (item.id === patientObject.id) {
        this.patient[index].name = value;
      }
    });
    return { id: patientObject.id, name: value };
  }

  async find(patientName) {
    let result = {};
    this.patient.forEach((item) => {
      if (item.name === patientName) {
        result = item;
      }
    });
    return result;
  }

  async get(patientID) {
    let result = {};
    this.patient.forEach((item) => {
      if (item.id === patientID) {
        result = item;
      }
    });
    return result;
  }

  async delete(patientObject) {
    let result;
    this.patient.forEach((item, index) => {
      if (item.id === patientObject.id) {
        result = index;
      }
    });
    this.patient.splice(result, 1);
    return result;
  }

  async getAllNames() {
    return this.patient.map((item) => item.name);
  }
}

const patientMemoryRepository = new PatientMemory();
export { patientMemoryRepository };
