import { STATUSES } from '../constants.js';

export function checkOutputStatus(res) {
  switch (res.getValue) {
    case 'not found':
      res.setStatus = STATUSES.NotFound;
      res.setValue = 'N/A';
      break;
    case 'timeout':
      res.setStatus = STATUSES.RequestTimeout;
      res.setValue = 'N/A';
      break;
    case 'error':
      res.setStatus = STATUSES.ServerError;
      res.setValue = 'N/A';
      break;
    case 'not available':
      res.setStatus = STATUSES.NotFound;
      res.setValue = 'N/A';
      break;
    case 'pushed':
      res.setStatus = STATUSES.Created;
      res.setValue = 'Added';
      break;
    default:
      res.setStatus = STATUSES.OK;
      break;
  }
  return res;
}
