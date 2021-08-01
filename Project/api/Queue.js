export default class Queue {
  constructor() {
    this.fifo = [];
  }

  Add(value) {
    this.fifo.push(value);
  }

  Get() {
    if (this.fifo.length === 0) {
      return false;
    }
    const result = this.fifo[0];
    this.fifo.shift();
    return result;
  }

  clone(restoredData) {
    this.fifo = restoredData.fifo;
  }
}
