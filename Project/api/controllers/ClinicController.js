import fs from 'fs';
import Queue from '../Queue.js';
import ProcessedPatients from '../ProcessedPatients.js';
import RequestResult from '../RequestResult.js';
import { STATUSES } from '../ResultStatuses.js';

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
    const result = new RequestResult();
    try {
      const data = JSON.stringify(this);
      fs.writeFileSync('queue.json', data, 'utf8');
      console.log('File is written successfully!');
      result.setStatus = STATUSES.OK;
      return result;
    } catch (err) {
      console.log(`Error writing file: ${err}`);
      result.setStatus = STATUSES.ServerError;
      return result;
    }
  }

  push(body) {
    this.readFile();
    this.queue.Add(body.value);
    return this.writeFile();
  }

  getCurrentValue() {
    this.readFile();
    const result = new RequestResult();
    result.setValue = this.currentValue;
    result.setStatus = STATUSES.OK;
    return result;
  }

  setCurrentResolution(body) {
    this.readFile();
    this.currentResolution = body.value;
    return this.writeFile();
  }

  next(body) {
    this.readFile();
    const nextPatient = this.queue.Get();
    if (nextPatient) {
      if (!(this.currentValue === 'Wait for a doctor') && !(this.currentValue === 'Wait for a patient')) {
        this.takenPatients.Set(this.currentValue, this.currentResolution, body.time);
      }
      this.currentValue = nextPatient;
      this.currentResolution = '';
    } else {
      if (!(this.currentValue === 'Wait for a doctor') && !(this.currentValue === 'Wait for a patient')) {
        this.takenPatients.Set(this.currentValue, this.currentResolution, body.time);
      }

      this.currentValue = 'Wait for a patient';
      this.currentResolution = '';
    }
    return this.writeFile();
  }

  getAllValue() {
    this.readFile();
    const result = new RequestResult();
    result.setValue = this.takenPatients.getAllValue();
    result.setStatus = STATUSES.OK;
    return result;
  }

  findResolution(body) {
    this.readFile();
    const result = new RequestResult();
    const patient = this.takenPatients.Get(body.value, body.time);

    if (patient) {
      result.setValue = patient;
      result.setStatus = STATUSES.OK;
    } else {
      result.setStatus = STATUSES.RequestTimeout;
      result.setValue = '';
    }
    return result;
  }

  deleteResolution(body) {
    this.readFile();
    const patient = this.takenPatients.Delete(body.value, body.time);

    if (patient) {
      return this.writeFile();
    }
    const result = new RequestResult();
    result.setStatus = STATUSES.RequestTimeout;
    result.setValue = '';
    return result;
  }

  copy(restoredData) {
    this.queue.clone(restoredData.queue);
    this.takenPatients.clone(restoredData.takenPatients);
    this.currentValue = restoredData.currentValue;
    this.currentResolution = restoredData.currentResolution;
  }
}
