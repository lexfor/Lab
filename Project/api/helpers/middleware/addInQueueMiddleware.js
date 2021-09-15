import Ajv from 'ajv';
import { NOT_AVAILABLE, STATUSES } from '../../../constants';
import { AddInQueueSchema } from '../schemas/AddInQueueSchema';

const ajv = new Ajv();

function addInQueueMiddleware(req, res, next) {
  const validationResult = ajv.validate(AddInQueueSchema, req.params);
  if (!validationResult) {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  } else {
    next();
  }
}

export { addInQueueMiddleware };
