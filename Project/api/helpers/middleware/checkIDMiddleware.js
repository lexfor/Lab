import Ajv from 'ajv';
import { NOT_AVAILABLE, STATUSES } from '../../../constants';
import { IDSchema } from '../schemas/IDSchema';

const ajv = new Ajv();

function checkIDMiddleware(req, res, next) {
  const validationResult = ajv.validate(IDSchema, req.params);
  if (!validationResult) {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  } else {
    next();
  }
}

export { checkIDMiddleware };
