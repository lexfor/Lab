import { v4 as uuidv4 } from 'uuid';
import { NOT_AVAILABLE } from '../../constants.js';

class ResolutionMemory {
  constructor() {
    this.resolutions = [];
  }

  async create(patientID, resolutionValue, time) {
    const uuid = uuidv4();
    this.resolutions.push({
      id: uuid,
      value: resolutionValue,
      delay: time,
      createdTime: new Date().getTime(),
      patient_id: patientID,
    });
    return uuid;
  }

  async update(resolutionID, resolutionValue, time) {
    this.resolutions.forEach((item, index) => {
      if (item.id === resolutionID) {
        this.resolutions[index].value = resolutionValue;
        this.resolutions[index].delay = time;
        this.resolutions[index].createdTime = new Date().getTime();
      }
    });
  }

  async getResolutionID(patientID) {
    let result;
    this.resolutions.forEach((item) => {
      if (item.patient_id === patientID) {
        result = item.id;
      }
    });
    return result;
  }

  async get(resolutionID) {
    let result = '';
    if (!this.checkTime(resolutionID)) {
      return result;
    }
    this.resolutions.forEach((item) => {
      if (item.id === resolutionID) {
        result = item.value;
      }
    });
    return result;
  }

  async delete(resolutionID) {
    this.resolutions.forEach((item, index) => {
      if (item.id === resolutionID) {
        this.resolutions[index].value = NOT_AVAILABLE;
      }
    });
  }

  async getAll() {
    return this.resolutions.map((item) => item.id);
  }

  checkTime(resolutionID) {
    let result = true;
    this.resolutions.forEach((item) => {
      if (item.id === resolutionID) {
        if (new Date().getTime() - item.createdTime > item.delay) {
          result = false;
        }
      }
    });
    return result;
  }
}

const resolutionMemoryRepository = new ResolutionMemory();
export { resolutionMemoryRepository };
