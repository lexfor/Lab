import Ajv from 'ajv';
import { NOT_AVAILABLE, STATUSES } from '../../../constants';
import { QueueIDSchema } from '../schemas/QueueIDSchema';

const ajv = new Ajv();

function checkQueueIDMiddleware(req, res, next) {
  const validationResult = ajv.validate(QueueIDSchema, req.params);
  if (!validationResult) {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  } else {
    next();
  }
}

export { checkQueueIDMiddleware };
