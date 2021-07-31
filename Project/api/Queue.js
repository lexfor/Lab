import Patient from './Patient.js';

export default class Queue {
  constructor() {
    this.queue = [];
    this.current = -1;
  }

  push(value, resolution) {
    const patient = new Patient();
    patient.setValue(value);
    patient.setResolution(resolution);
    this.queue.push(patient);
  }

  getCurrentValue() {
    if (this.current === -1) {
      return 'Wait for a doctor';
    }
    return this.queue[this.current].getValue();
  }

  setCurrentResolution(resolution) {
    this.queue[this.current].setResolution(resolution);
  }

  next() {
    if (this.current + 1 === this.queue.length) {
      return false;
    }
    this.current += 1;
    return true;
  }

  getAllValue() {
    return this.queue.map((item) => item.getValue());
  }

  findResolution(value) {
    let res = 'Patient N/A';
    this.queue.forEach((item) => {
      if (value === item.getValue()) {
        res = item.getResolution();
      }
    });
    return res;
  }

  deleteResolution(value) {
    this.queue.forEach((item) => {
      if (value === item.getValue()) {
        item.setResolution('N/A');
      }
    });
  }

  copy(restoredQueue) {
    restoredQueue.queue.forEach((item) => {
      this.push(item.value, item.resolution);
      this.current = restoredQueue.current;
    });
  }
}
