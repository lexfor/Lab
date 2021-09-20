import Ajv from 'ajv';
import { LogingSchema } from '../schemas/LogingSchema';
import { NOT_AVAILABLE, STATUSES } from '../../../constants';

const ajv = new Ajv();

function checkLoginDataMiddleware(req, res, next) {
  const validationResult = ajv.validate(LogingSchema, req.body);
  if (validationResult) {
    next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}

export { checkLoginDataMiddleware };
