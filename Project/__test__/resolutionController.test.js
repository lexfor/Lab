import { resolutionController } from '../api/controllers/resolutionController.js';
import { queue } from '../api/service/Queue';

describe('Resolution controller', () => {
  test('get all processed patients vale with empty storage', () => {
    const result = resolutionController.getAllProcessedPatientsValue();
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(503);
  });

  test('set resolution without TTL', () => {
    queue.Push('Tim');
    const result = resolutionController.setResolutionForCurrentPatient({ value: 'All good' });
    expect(result.getValue).toEqual('Added');
    expect(result.getStatus).toEqual(201);
  });

  test('set resolution with TTL', () => {
    queue.Push('Dima');
    queue.Pop();
    const result = resolutionController.setResolutionForCurrentPatient({ value: 'All fine', time: 3000 });
    expect(result.getValue).toEqual('Added');
    expect(result.getStatus).toEqual(201);
  });

  test('set resolution without any patients in queue', () => {
    queue.Pop();
    const result = resolutionController.setResolutionForCurrentPatient('All fine');
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(503);
  });

  test('get all processed patients vale', () => {
    const result = resolutionController.getAllProcessedPatientsValue();
    expect(result.getValue).toEqual(['Tim', 'Dima']);
    expect(result.getStatus).toEqual(200);
  });

  test('find patient resolution', () => {
    const result = resolutionController.findResolution('Dima');
    expect(result.getValue).toEqual('All fine');
    expect(result.getStatus).toEqual(200);
  });

  test('find not existed patient resolution', () => {
    const result = resolutionController.findResolution('Anton');
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(404);
  });

  test('delete patient resolution', () => {
    resolutionController.deleteResolution('Tim');
    const result = resolutionController.findResolution('Tim');
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(200);
  });

  test('delete not existed patient resolution', () => {
    const result = resolutionController.deleteResolution('Anton');
    expect(result.getValue).toEqual('N/A');
    expect(result.getStatus).toEqual(404);
  });
});
