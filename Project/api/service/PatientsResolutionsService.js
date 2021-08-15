export default class PatientsResolutionsService {
  constructor(storage) {
    this.resolutionStorage = storage;
  }

  async createResolution(value) {
    try {
      await this.resolutionStorage.set(value, '');
    } catch (e) {
      return 'error';
    }
    return 'pushed';
  }

  async updateResolution(value, resolution, time) {
    try {
      await this.resolutionStorage.set(value, resolution, time);
    } catch (e) {
      return 'error';
    }
    return 'updated';
  }

  async getResolution(value) {
    try {
      const res = await this.resolutionStorage.get(value);
      if (res) {
        return res;
      }

      return 'not found';
    } catch (e) {
      return 'error';
    }
  }

  async deleteResolution(value) {
    try {
      if (await this.resolutionStorage.has(value)) {
        await this.resolutionStorage.set(value, 'N/A');
        return 'deleted';
      }
      return 'not found';
    } catch (e) {
      return 'error';
    }
  }

  async getAllValue() {
    try {
      return await this.resolutionStorage.getAll();
    } catch (e) {
      return 'error';
    }
  }

  async isExist(value) {
    const values = await this.resolutionStorage.getAll();
    return values.indexOf(value) !== -1;
  }

  async isEmpty() {
    const result = await this.resolutionStorage.getAll();
    return result.length === 0;
  }
}
