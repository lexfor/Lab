import { queue } from '../service/Queue.js';
import { STATUSES } from '../constants.js';
import RequestResult from '../RequestResult.js';
import { validateValue } from '../helpers/Validator.js';
import { checkInputStatus, checkOutputStatus } from '../helpers/StatusHelper.js';

export function addInQueue(body) {
  let res = new RequestResult();
  res.setStatus = validateValue(body);
  res = checkInputStatus(res);
  if (res.getStatus !== STATUSES.OK) {
    return res;
  }

  res.setValue = queue.Push(body);
  return checkOutputStatus(res);
}

export function getCurrentInQueue() {
  const res = new RequestResult();
  res.setValue = queue.Get();
  return checkOutputStatus(res);
}

export function next() {
  const res = new RequestResult();
  res.setValue = queue.Pop();
  return checkOutputStatus(res);
}
