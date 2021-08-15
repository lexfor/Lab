class QueueStorage {
  constructor() {
    this.fifo = [];
  }

  push(value) {
    this.fifo.push(value);
  }

  shift() {
    this.fifo.shift();
  }

  getFirst() {
    if (!this.fifo[0]) {
      return null;
    }
    return this.fifo[0];
  }

  getAll() {
    return this.fifo;
  }
}

const queueInMemoryStorage = new QueueStorage();
export { queueInMemoryStorage };
