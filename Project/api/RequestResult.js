export default class requestResult {
  constructor() {
    this.status = 0;
    this.value = '';
  }

  set setStatus(status) {
    this.status = status;
  }

  set setValue(value) {
    this.value = value;
  }

  get getStatus() {
    return this.status;
  }

  get getValue() {
    return this.value;
  }
}
