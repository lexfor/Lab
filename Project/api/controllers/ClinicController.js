import fs from 'fs';
import Queue from '../Queue.js';
import ProcessedPatients from '../ProcessedPatients.js';

export default class ClinicController {
  constructor() {
    this.queue = new Queue();
    this.takenPatients = new ProcessedPatients();
    this.currentValue = 'Wait for a doctor';
    this.currentResolution = '';
  }

  readFile() {
    try {
      const data = fs.readFileSync('queue.json', 'utf8');
      const result = JSON.parse(data);
      this.copy(result);
    } catch (err) {
      console.log(`Error reading file from disk: ${err}`);
    }
  }

  writeFile() {
    try {
      const data = JSON.stringify(this);
      fs.writeFileSync('queue.json', data, 'utf8');
      console.log('File is written successfully!');
      return true;
    } catch (err) {
      console.log(`Error writing file: ${err}`);
      return false;
    }
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
