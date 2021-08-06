export default class TTL {
  constructor(key, delay) {
    this.key = key;
    this.delay = delay;
    this.time = new Date().getTime();
  }

  checkTime() {
    if (!this.delay) {
      return true;
    }
    return new Date().getTime() - this.time <= this.delay;
  }

  get getKey() {
    return this.key;
  }
}
