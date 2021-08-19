import { STATUSES, NOT_AVAILABLE } from '../../constants.js';

export function checkOutputStatus(res) {
  switch (res.getValue) {
    case 'not found':
      res.setStatus = STATUSES.NotFound;
      res.setValue = NOT_AVAILABLE;
      break;
    case 'timeout':
      res.setStatus = STATUSES.RequestTimeout;
      res.setValue = NOT_AVAILABLE;
      break;
    case 'error':
      res.setStatus = STATUSES.ServerError;
      res.setValue = NOT_AVAILABLE;
      break;
    case 'not available':
      res.setStatus = STATUSES.Unavailable;
      res.setValue = NOT_AVAILABLE;
      break;
    case 'pushed':
      res.setStatus = STATUSES.Created;
      res.setValue = 'Added';
      break;
    case 'updated':
      res.setStatus = STATUSES.Accepted;
      res.setValue = 'Accepted';
      break;
    default:
      res.setStatus = STATUSES.OK;
      break;
  }
  return res;
}
