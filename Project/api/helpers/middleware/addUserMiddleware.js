import Ajv from 'ajv';
import { AddUserSchema } from '../schemas/AddUserSchema';
import { NOT_AVAILABLE, STATUSES } from '../../../constants';

const ajv = new Ajv();

function addUserMiddleware(req, res, next) {
  const validationResult = ajv.validate(AddUserSchema, req.body);
  if (validationResult) {
    next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}

export { addUserMiddleware };
