import { patients } from '../service/ProcessedPatients.js';
import { queue } from '../service/Queue.js';
import RequestResult from '../RequestResult.js';
import { STATUSES } from '../constants.js';
import { validateValue, validateResolution } from '../helpers/Validator.js';
import { checkInputStatus, checkOutputStatus } from '../helpers/StatusHelper.js';

export function setResolution(body) {
  let res = new RequestResult();
  res.setStatus = validateResolution(body);
  res = checkInputStatus(res);
  if (res.getStatus !== STATUSES.OK) {
    return res;
  }

  res.setValue = patients.Set(queue.Get(), body.value, body.time);
  return checkOutputStatus(res);
}

export function getAll() {
  const res = new RequestResult();
  res.setValue = patients.getAllValue();
  return checkOutputStatus(res);
}

export function getResolution(body) {
  let res = new RequestResult();
  res.status = validateValue(body);
  res = checkInputStatus(res);
  if (res.getStatus !== STATUSES.OK) {
    return res;
  }

  res.setValue = patients.Get(body);
  return checkOutputStatus(res);
}

export function deleteResolution(body) {
  let res = new RequestResult();
  res.setStatus = validateValue(body);
  res = checkInputStatus(res);
  if (res.getStatus !== STATUSES.OK) {
    return res;
  }

  res.setValue = patients.Delete(body);
  return checkOutputStatus(res);
}
