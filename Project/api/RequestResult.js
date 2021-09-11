export default class RequestResult {
  constructor() {
    this.status = 200;
    this.value = '';
  }

  /**
   * @param {number} status
   */
  set setStatus(status) {
    this.status = status;
  }

  /**
   * @param {string} value
   */
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
