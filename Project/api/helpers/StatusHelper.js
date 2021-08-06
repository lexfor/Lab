import { STATUSES } from '../constants.js';

export function checkOutputStatus(res) {
  switch (res.getValue) {
    case 'not found':
      res.setStatus = STATUSES.NotFound;
      res.setValue = '';
      break;
    case 'timeout':
      res.setStatus = STATUSES.RequestTimeout;
      res.setValue = '';
      break;
    case 'error':
      res.setStatus = STATUSES.ServerError;
      res.setValue = '';
      break;
    case 'not available':
      res.setStatus = STATUSES.NotFound;
      res.setValue = '';
      break;
    default:
      res.setStatus = STATUSES.OK;
      break;
  }
  return res;
}

export function checkInputStatus(res) {
  if (res.setStatus !== STATUSES.OK) {
    res.setValue = '';
  }
  return res;
}
