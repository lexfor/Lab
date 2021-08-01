import Patient from './Patient.js';

export default class ProcessedPatients {
  constructor() {
    this.taken = [];
  }

  Set(value, resolution) {
    let has = false;
    this.taken.forEach((item, index) => {
      if (value === item.getValue()) {
        has = true;
        this.taken[index] = resolution;
      }
    });
    if (!has) {
      const patient = new Patient();
      patient.setValue(value);
      patient.setResolution(resolution);
      this.taken.push(patient);
    }
  }

  Get(value) {
    let res = 'Patient N/A';
    console.log(value);
    this.taken.forEach((item) => {
      if (item.getValue() === value) {
        res = item.getResolution();
      }
    });
    return res;
  }

  Delete(value) {
    this.taken.forEach((item, index) => {
      if (item.getValue() === value) {
        this.taken.splice(index);
      }
    });
  }

  getAllValue() {
    return this.taken.map((item) => item.getValue());
  }

  clone(restoredData) {
    restoredData.taken.forEach((item) => {
      this.Set(item.value, item.resolution);
    });
  }
}
