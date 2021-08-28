import { v4 as uuidv4 } from 'uuid';
import { NOT_AVAILABLE } from '../../../constants.js';

class ResolutionMemory {
  constructor() {
    this.resolutions = [];
  }

  async create(patient, resolutionValue, time) {
    const uuid = uuidv4();
    this.resolutions.push({
      id: uuid,
      value: resolutionValue,
      delay: time,
      createdTime: new Date().getTime(),
      patient_id: patient.id,
    });
    return {
      id: uuid,
      value: resolutionValue,
      patient_id: patient.id,
    };
  }

  async update(resolution, resolutionValue, time) {
    this.resolutions.forEach((item, index) => {
      if (item.id === resolution.id) {
        this.resolutions[index].value = resolutionValue;
        this.resolutions[index].delay = time;
        this.resolutions[index].createdTime = new Date().getTime();
      }
    });
  }

  async get(patient) {
    let result;
    this.resolutions.forEach((item) => {
      if (item.patient_id === patient.id) {
        result = item;
      }
    });
    if (!result) {
      return { value: NOT_AVAILABLE };
    }
    if (this.checkTime(result)) {
      return result;
    }
    return { value: NOT_AVAILABLE };
  }

  async delete(resolution) {
    this.resolutions.forEach((item, index) => {
      if (item.id === resolution.id) {
        this.resolutions[index].value = NOT_AVAILABLE;
      }
    });
  }

  async getAll() {
    return this.resolutions.map((item) => item.id);
  }

  checkTime(resolution) {
    let result = true;
    if (new Date().getTime() - resolution.createdTime > resolution.delay) {
      result = false;
    }
    return result;
  }
}

const resolutionMemoryRepository = new ResolutionMemory();
export { resolutionMemoryRepository };
