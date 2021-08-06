import TTL from './TTL.js';

class ProcessedPatients {
  constructor() {
    this.taken = new Map();
    this.TTL = [];
  }

  Set(value, resolution, time) {
    try {
      this.taken.set(value, resolution);
      this.TTL.push(new TTL(value, time));
    } catch (e) {
      return 'error';
    }
    return 'added';
  }

  Get(value) {
    let timeResult = false;
    this.TTL.forEach((item) => {
      if (item.getKey === value) {
        timeResult = item.checkTime();
      }
    });

    if (!timeResult) {
      return 'timeout';
    }

    try {
      const res = this.taken.get(value);
      if (res) {
        return res;
      }

      return 'not found';
    } catch (e) {
      return 'error';
    }
  }

  Delete(value) {
    try {
      if (this.taken.set(value, 'N/A')) {
        return 'deleted';
      }
      return 'not found';
    } catch (e) {
      return 'error';
    }
  }

  getAllValue() {
    try {
      return Array.from(this.taken.keys());
    } catch (e) {
      return 'error';
    }
  }
}

const patients = new ProcessedPatients();
export { patients };
