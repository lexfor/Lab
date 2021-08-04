import Patient from './Patient.js';

export default class ProcessedPatients {
  constructor() {
    this.taken = [];
  }

  checkTime(reqTime) {
    const time = new Date();
    const res = time.getTime() - reqTime;
    return res <= 30 * 1000;
  }

  Set(value, resolution, reqTime) {
    if (!this.checkTime(reqTime)) {
      return false;
    }
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
    return true;
  }

  Get(value, reqTime) {
    if (!this.checkTime(reqTime)) {
      return false;
    }
    let res = 'Patient N/A';
    this.taken.forEach((item) => {
      if (item.getValue() === value) {
        res = item.getResolution();
      }
    });
    return res;
  }

  Delete(value, reqTime) {
    let res = 'not found';
    if (!this.checkTime(reqTime)) {
      return false;
    }
    this.taken.forEach((item, index) => {
      if (item.getValue() === value) {
        this.taken[index].setResolution('N/A');
        res = 'deleted';
      }
    });
    return res;
  }

  getAllValue() {
    return this.taken.map((item) => item.getValue());
  }

  clone(restoredData) {
    this.taken.length = 0;
    restoredData.taken.forEach((item) => {
      this.Set(item.value, item.resolution, new Date().getTime());
    });
  }
}
