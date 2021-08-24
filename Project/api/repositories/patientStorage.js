import { v4 as uuidv4 } from 'uuid';

class PatientStorage {
  constructor() {
    this.patient = [];
  }

  async create(value) {
    const uuid = uuidv4();
    this.patient.push({ id: uuid, name: value });
    return uuid;
  }

  async update(patientID, value) {
    this.patient.forEach((item, index) => {
      if (item.id === patientID) {
        this.patient[index].name = value;
      }
    });
    return 'updated';
  }

  async find(patientName) {
    let result;
    this.patient.forEach((item) => {
      if (item.name === patientName) {
        result = item.id;
      }
    });
    return result;
  }

  async get(patientID) {
    let result = '';
    this.patient.forEach((item) => {
      if (item.id === patientID) {
        result = item.name;
      }
    });
    return result;
  }

  async delete(patientID) {
    let result;
    this.patient.forEach((item, index) => {
      if (item.id === patientID) {
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

const patientInMemoryStorage = new PatientStorage();
export { patientInMemoryStorage };
