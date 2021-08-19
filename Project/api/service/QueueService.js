export default class QueueService {
  constructor(storage) {
    this.queueStorage = storage;
  }

  async push(value) {
    try {
      await this.queueStorage.push(value);
    } catch (e) {
      return 'error';
    }
    return 'pushed';
  }

  async pop() {
    try {
      await this.queueStorage.shift();
    } catch (e) {
      return 'error';
    }
    return 'shifted';
  }

  async getCurrent() {
    try {
      return await this.queueStorage.getFirst();
    } catch (e) {
      return 'error';
    }
  }

  async isExist(value) {
    const fifo = await this.queueStorage.getAll();
    return fifo.indexOf(value) !== -1;
  }

  async isEmpty() {
    const fifo = await this.queueStorage.getAll();
    return fifo.length === 0;
  }
}
