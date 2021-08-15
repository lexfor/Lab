export default class RequestResult {
  constructor() {
    this.status = 200;
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
