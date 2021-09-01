import { STATUSES, NOT_AVAILABLE } from '../../constants.js';

export function checkOutputStatus(res) {
  switch (res.getValue) {
    case 'not found':
      res.setStatus = STATUSES.NOT_FOUND;
      res.setValue = NOT_AVAILABLE;
      break;
    case 'no such user':
      res.setStatus = STATUSES.NOT_FOUND;
      res.setValue = NOT_AVAILABLE;
      break;
    case 'timeout':
      res.setStatus = STATUSES.REQUEST_TIMEOUT;
      res.setValue = NOT_AVAILABLE;
      break;
    case 'error':
      res.setStatus = STATUSES.SERVER_ERROR;
      res.setValue = NOT_AVAILABLE;
      break;
    case 'not available':
      res.setStatus = STATUSES.UNAVAILABLE;
      res.setValue = NOT_AVAILABLE;
      break;
    case 'pushed':
      res.setStatus = STATUSES.CREATED;
      res.setValue = 'Added';
      break;
    case 'updated':
      res.setStatus = STATUSES.ACCEPTED;
      res.setValue = 'Accepted';
      break;
    case {}:
      res.setStatus = STATUSES.NOT_FOUND;
      res.setValue = NOT_AVAILABLE;
      break;
    default:
      res.setStatus = STATUSES.OK;
      break;
  }
  return res;
}
