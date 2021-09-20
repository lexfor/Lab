export default class RequestResult {
  constructor() {
    this.status = 200;
    this.value = '';
  }

  /**
   * Set HTTP status
   * @param {number} status
   */
  set setStatus(status) {
    this.status = status;
  }

  /**
   * Set result
   * @param {string} value
   */
  set setValue(value) {
    this.value = value;
  }

  /**
   * Get HTTP status
   * @returns {number} status
   */
  get getStatus() {
    return this.status;
  }

  /**
   * Get value
   * @returns {string} value
   */
  get getValue() {
    return this.value;
  }
}
