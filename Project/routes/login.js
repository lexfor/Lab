import express from 'express';
import Ajv from 'ajv';
import { injector } from '../Injector';
import { LogingSchema } from '../api/helpers/schemas/LogingSchema';
import { NOT_AVAILABLE, STATUSES } from '../constants';

const router = express();
const ajv = new Ajv();
const authenticationController = injector.getAuthenticationController;
router.get('/', (req, res) => {
  res.sendFile('./public/login/login.html', { root: './Project' });
});

router.post('/authentication', async (req, res, next) => {
  const validationResult = ajv.validate(LogingSchema, req.body);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
},

async (req, res) => {
  const result = await authenticationController.logIn(req.body);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
