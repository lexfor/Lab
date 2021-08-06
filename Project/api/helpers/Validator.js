import { MAX_LENGTH, STATUSES } from '../constants.js';

export function validateValue(value) {
  if (value.length === 0) {
    return STATUSES.BadRequest;
  }

  if (value.length > MAX_LENGTH) {
    return STATUSES.BadRequest;
  }

  if (!Number.isNaN(value)) {
    return STATUSES.BadRequest;
  }

  return STATUSES.OK;
}

export function validateResolution(body) {
  if (body.value.length === 0) {
    return STATUSES.BadRequest;
  }

  if (body.value.length > MAX_LENGTH) {
    return STATUSES.BadRequest;
  }

  if (body.time < 0) {
    return STATUSES.BadRequest;
  }

  return STATUSES.OK;
}
