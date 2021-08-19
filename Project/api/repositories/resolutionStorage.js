class ResolutionStorage {
  constructor() {
    this.resolution = new Map();
    this.TTL = [];
  }

  async set(value, resolution, time) {
    this.resolution.set(value, resolution);
    let itemIndex = -1;
    this.TTL.forEach((item, index) => {
      if (item.key === value) {
        itemIndex = index;
      }
    });

    if (itemIndex === -1) {
      this.TTL.push({ key: value, timeDelay: time, timeNow: new Date().getTime() });
    } else {
      this.TTL[itemIndex].timeDelay = time;
      this.TTL[itemIndex].timeNow = new Date().getTime();
    }
  }

  async get(value) {
    let itemIndex = -1;
    this.TTL.forEach((item, index) => {
      if (item.key === value) {
        itemIndex = index;
      }
    });

    if (itemIndex === -1) {
      return '';
    }

    if (!this.TTL[itemIndex].timeDelay) {
      return this.resolution.get(value);
    }

    if ((new Date().getTime() - this.TTL[itemIndex].timeNow) <= this.TTL[itemIndex].timeDelay) {
      return this.resolution.get(value);
    }
    return '';
  }

  async has(value) {
    return this.resolution.has(value);
  }

  async getAll() {
    return Array.from(this.resolution.keys());
  }
}

const resolutionInMemoryStorage = new ResolutionStorage();
export { resolutionInMemoryStorage };
