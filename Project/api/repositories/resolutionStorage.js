import { v4 as uuidv4 } from 'uuid';
import { NOT_AVAILABLE } from '../../constants.js';

class ResolutionStorage {
  constructor() {
    this.resolutions = [];
  }

  async create(resolutionValue, time) {
    const uuid = uuidv4();
    this.resolutions.push({
      id: uuid,
      value: resolutionValue,
      delay: time,
      createdTime: new Date().getTime(),
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

  async get(resolutionID) {
    let result = '';
    this.checkTime(resolutionID);
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
    this.resolutions.forEach((item, index) => {
      if (item.id === resolutionID) {
        if (new Date().getTime() - item.createdTime > item.delay) {
          this.resolutions[index].value = NOT_AVAILABLE;
        }
      }
    });
  }
}

const resolutionInMemoryStorage = new ResolutionStorage();
export { resolutionInMemoryStorage };
