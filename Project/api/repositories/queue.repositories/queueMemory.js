class QueueMemory {
  constructor() {
    this.fifo = [];
  }

  push(id) {
    this.fifo.push(id);
    return 'pushed';
  }

  shift() {
    this.fifo.shift();
    return 'shifted';
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

const queueMemoryRepository = new QueueMemory();
export { queueMemoryRepository };
