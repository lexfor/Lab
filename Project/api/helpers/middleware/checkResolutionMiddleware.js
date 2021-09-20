import Ajv from 'ajv';
import { NOT_AVAILABLE, STATUSES } from '../../../constants';
import { ValueSchema } from '../schemas/valueSchema';
import { IDSchema } from '../schemas/IDSchema';

const ajv = new Ajv();

function checkResolutionMiddleware(req, res, next) {
  const validationResult = ajv.validate(ValueSchema, req.body);
  const validationUserResult = ajv.validate(IDSchema, req.params);
  if (validationResult && validationUserResult) {
    next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}

export { checkResolutionMiddleware };
