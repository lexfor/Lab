class Queue {
  constructor() {
    this.fifo = [];
  }

  Push(value) {
    if (this.fifo.indexOf(value) !== -1) {
      return false;
    }

    try {
      this.fifo.push(value);
    } catch (e) {
      return 'error';
    }
    return 'pushed';
  }

  Pop() {
    if (this.fifo.length === 0) {
      return 'not available';
    }

    try {
      this.fifo.shift();
    } catch (e) {
      return 'error';
    }
    return 'shifted';
  }

  Get() {
    if (this.fifo.length === 0) {
      return 'not available';
    }

    try {
      return this.fifo[0];
    } catch (e) {
      return 'error';
    }
  }
}

const queue = new Queue();
export { queue };
