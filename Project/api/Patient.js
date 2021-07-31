export default class Patient {
  constructor() {
    this.value = '';
    this.resolution = 'N/A';
  }

  getResolution() {
    return this.resolution;
  }

  setResolution(resolution) {
    this.resolution = resolution;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }
}
