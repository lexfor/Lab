export const MAX_LENGTH = 30;

export const MIN_LENGTH = 2;

export const STATUSES = {
  OK: 200,
  Created: 201,
  Accepted: 202,
  BadRequest: 400,
  NotFound: 404,
  RequestTimeout: 408,
  ServerError: 500,
  Unavailable: 503,
};

export const STORAGE_NAME = {
  REDIS: 'redis',
  MEMORY: 'memory',
  SQL: 'sql',
};

export const SERVER_PORT = {
  REDIS_PORT: 6379,
  SQL_PORT: 3306,
  APP_PORT: 3000,
};

export const NOT_AVAILABLE = 'N/A';
