import { patients } from '../api/service/ProcessedPatients.js';

describe('patient service', () => {
  test('add patient in key-value storage without TTL', () => {
    const result = patients.Set('Timofei', 'good');
    expect(result).toEqual('pushed');
  });

  test('add patient in key-value storage with TTL', () => {
    const result = patients.Set('Dima', 'All fine', 300);
    expect(result).toEqual('pushed');
  });

  test('get patient from key-value storage without TTL', () => {
    const result = patients.Get('Timofei');
    expect(result).toEqual('good');
  });

  test('get not existed patient from key-value storage', () => {
    const result = patients.Get('Andrei');
    expect(result).toEqual('not found');
  });

  test('get patient from key-value storage with TTL in time', () => {
    const result = patients.Get('Dima');
    expect(result).toEqual('All fine');
  });

  test('get all patients from key-value storage', () => {
    const result = patients.getAllValue();
    expect(result).toEqual(['Timofei', 'Dima']);
  });

  test('get patient from key-value storage with TTL not in time', (done) => {
    setTimeout(() => {
      const result = patients.Get('Dima');
      expect(result).toEqual('timeout');
      done();
    }, 500);
  });

  test('delete patient resolution from key-value storage', () => {
    const result = patients.Delete('Timofei');
    expect(result).toEqual('deleted');
  });

  test('delete not existed patient resolution from key-value storage', () => {
    const result = patients.Delete('Andrei');
    expect(result).toEqual('not found');
  });
});
