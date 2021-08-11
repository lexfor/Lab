import { checkOutputStatus } from '../api/helpers/StatusHelper.js';
import RequestResult from '../api/RequestResult.js';

describe('Status helper', () => {
  test('empty RequestResult', () => {
    const res = new RequestResult();
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(200);
  });

  test('not found result', () => {
    let res = new RequestResult();
    res.setValue = 'not found';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('N/A');
    expect(res.getStatus).toEqual(404);
  });

  test('timeout result', () => {
    let res = new RequestResult();
    res.setValue = 'timeout';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('N/A');
    expect(res.getStatus).toEqual(408);
  });

  test('error result', () => {
    let res = new RequestResult();
    res.setValue = 'error';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('N/A');
    expect(res.getStatus).toEqual(500);
  });

  test('not available result', () => {
    let res = new RequestResult();
    res.setValue = 'not available';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('N/A');
    expect(res.getStatus).toEqual(503);
  });

  test('pushed result', () => {
    let res = new RequestResult();
    res.setValue = 'pushed';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('Added');
    expect(res.getStatus).toEqual(201);
  });

  test('OK result', () => {
    let res = new RequestResult();
    res.setValue = 'OK';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('OK');
    expect(res.getStatus).toEqual(200);
  });
});
