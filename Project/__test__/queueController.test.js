import { queueController } from '../api/controllers/queueController.js';

describe('Queue controller', () => {
  test('add value in queue', () => {
    const result = queueController.addValueInQueue('Tim');
    expect(result.getValue).toEqual('Added');
    expect(result.getStatus).toEqual(201);
  });

  test('add existed value in queue', () => {
    const result = queueController.addValueInQueue('Tim');
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(400);
  });

  test('get current value from queue', () => {
    const result = queueController.getCurrentInQueue();
    expect(result.getValue).toEqual('Tim');
    expect(result.getStatus).toEqual(200);
  });

  test('pop value from queue', () => {
    const result = queueController.takeNextValueInQueue();
    expect(result.getValue).toEqual('shifted');
    expect(result.getStatus).toEqual(200);
  });

  test('pop value from empty queue', () => {
    const result = queueController.takeNextValueInQueue();
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(503);
  });

  test('get current value from empty queue', () => {
    const result = queueController.takeNextValueInQueue();
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(503);
  });
});
