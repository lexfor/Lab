import { checkOutputStatus } from '../api/helpers/StatusHelper.js';
import RequestResult from '../api/RequestResult.js';
import { STATUSES } from '../constants.js';

describe('Status helper', () => {
  test('empty RequestResult', () => {
    const res = new RequestResult();
    expect(res.getValue).toEqual('');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });

  test('not found result', () => {
    let res = new RequestResult();
    res.setValue = 'not found';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('N/A');
    expect(res.getStatus).toEqual(STATUSES.NotFound);
  });

  test('timeout result', () => {
    let res = new RequestResult();
    res.setValue = 'timeout';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('N/A');
    expect(res.getStatus).toEqual(STATUSES.RequestTimeout);
  });

  test('error result', () => {
    let res = new RequestResult();
    res.setValue = 'error';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('N/A');
    expect(res.getStatus).toEqual(STATUSES.ServerError);
  });

  test('not available result', () => {
    let res = new RequestResult();
    res.setValue = 'not available';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('N/A');
    expect(res.getStatus).toEqual(STATUSES.Unavailable);
  });

  test('pushed result', () => {
    let res = new RequestResult();
    res.setValue = 'pushed';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('Added');
    expect(res.getStatus).toEqual(STATUSES.Created);
  });

  test('OK result', () => {
    let res = new RequestResult();
    res.setValue = 'OK';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('OK');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });
});
