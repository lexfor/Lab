class QueueMemory {
  constructor() {
    this.fifo = [];
  }

  push(patient) {
    this.fifo.push(patient.id);
    return patient;
  }

  shift() {
    const resulut = this.fifo[0];
    this.fifo.shift();
    return resulut;
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
