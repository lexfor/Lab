import Queue from './Queue.js';
import ProcessedPatients from './ProcessedPatients.js';

export default class Clinic {
  constructor() {
    this.queue = new Queue();
    this.takenPatients = new ProcessedPatients();
    this.currentValue = 'Wait for a doctor';
    this.currentResolution = '';
  }

  push(value) {
    this.queue.Add(value);
  }

  getCurrentValue() {
    return this.currentValue;
  }

  setCurrentResolution(resolution) {
    this.currentResolution = resolution;
  }

  next() {
    const nextPatient = this.queue.Get();
    if (nextPatient) {
      if (!(this.currentValue === 'Wait for a doctor') && !(this.currentValue === 'Wait for a patient')) {
        this.takenPatients.Set(this.currentValue, this.currentResolution);
      }
      this.currentValue = nextPatient;
      this.currentResolution = '';
      return true;
    }
    console.log('Nothing');
    if (!(this.currentValue === 'Wait for a doctor') && !(this.currentValue === 'Wait for a patient')) {
      this.takenPatients.Set(this.currentValue, this.currentResolution);
    }
    this.currentValue = 'Wait for a patient';
    this.currentResolution = '';
    return true;
  }

  getAllValue() {
    return this.takenPatients.getAllValue();
  }

  findResolution(value) {
    return this.takenPatients.Get(value);
  }

  deleteResolution(value) {
    this.takenPatients.Delete(value);
  }

  copy(restoredData) {
    this.queue.clone(restoredData.queue);
    this.takenPatients.clone(restoredData.takenPatients);
    this.currentValue = restoredData.currentValue;
    this.currentResolution = restoredData.currentResolution;
  }
}
