import { STATUSES } from '../../constants';

export default class ApiError extends Error {
  constructor(message, status = STATUSES.SERVER_ERROR) {
    super(message);
    this.status = status;
  }
}
