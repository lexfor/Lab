import Ajv from 'ajv';
import { UserSchema } from '../schemas/UserSchema';
import { NOT_AVAILABLE, STATUSES } from '../../../constants';

const ajv = new Ajv();

function checkUserMiddleware(req, res, next) {
  const validationResult = ajv.validate(UserSchema, req.body);
  if (validationResult) {
    next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}

export { checkUserMiddleware };
