class Queue {
  constructor() {
    this.fifo = [];
  }

  Push(value) {
    try {
      this.fifo.push(value);
    } catch (e) {
      return 'error';
    }
    return 'pushed';
  }

  Pop() {
    try {
      this.fifo.shift();
    } catch (e) {
      return 'error';
    }
    return 'shifted';
  }

  Get() {
    try {
      return this.fifo[0];
    } catch (e) {
      return 'error';
    }
  }
}

const queue = new Queue();
export { queue };
