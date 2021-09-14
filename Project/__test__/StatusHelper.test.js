import { checkOutputStatus } from '../api/helpers/StatusHelper';
import RequestResult from '../api/RequestResult';
import { STATUSES } from '../constants';

describe('Status helper unit tests', () => {
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
    expect(res.getStatus).toEqual(STATUSES.NOT_FOUND);
  });

  test('timeout result', () => {
    let res = new RequestResult();
    res.setValue = 'timeout';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('N/A');
    expect(res.getStatus).toEqual(STATUSES.REQUEST_TIMEOUT);
  });

  test('error result', () => {
    let res = new RequestResult();
    res.setValue = 'error';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('N/A');
    expect(res.getStatus).toEqual(STATUSES.SERVER_ERROR);
  });

  test('not available result', () => {
    let res = new RequestResult();
    res.setValue = 'not available';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('N/A');
    expect(res.getStatus).toEqual(STATUSES.UNAVAILABLE);
  });

  test('pushed result', () => {
    let res = new RequestResult();
    res.setValue = 'pushed';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('Added');
    expect(res.getStatus).toEqual(STATUSES.CREATED);
  });

  test('OK result', () => {
    let res = new RequestResult();
    res.setValue = 'OK';
    res = checkOutputStatus(res);
    expect(res.getValue).toEqual('OK');
    expect(res.getStatus).toEqual(STATUSES.OK);
  });
});
