import Ajv from 'ajv';
import { NOT_AVAILABLE, STATUSES } from '../../../constants';
import { SetResolutionSchema } from '../schemas/SetResolutionSchema';
import { IDSchema } from '../schemas/IDSchema';

const ajv = new Ajv();

function addResolutionMiddleware(req, res, next) {
  const validationResult = ajv.validate(SetResolutionSchema, req.body);
  const validationUserResult = ajv.validate(IDSchema, req.params);
  if (validationResult && validationUserResult) {
    next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}

export { addResolutionMiddleware };
