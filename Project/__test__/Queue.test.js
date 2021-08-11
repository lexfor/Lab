import { queue } from '../api/service/Queue.js';

describe('queue service', () => {
  test('add patient in queue', () => {
    const result = queue.Push('Timofei');
    expect(result).toEqual('pushed');
  });

  test('get first patient from queue', () => {
    const result = queue.Get();
    expect(result).toEqual('Timofei');
  });

  test('pop patient from queue', () => {
    const result = queue.Pop();
    expect(result).toEqual('shifted');
  });

  test('pop patient from empty queue', () => {
    const result = queue.Pop();
    expect(result).toEqual('shifted');
  });

  test('get patient from empty queue', () => {
    const result = queue.Get();
    expect(result).toBeUndefined();
  });
});
