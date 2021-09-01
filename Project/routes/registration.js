import express from 'express';
import Ajv from 'ajv';
import { injector } from '../Injector.js';
import { AddUserSchema } from '../api/helpers/schemas/AddUserSchema.js';
import { NOT_AVAILABLE, STATUSES } from '../constants.js';

const router = express();
const ajv = new Ajv();
const authenticationController = injector.getAuthenticationController;

router.get('/', (req, res) => {
  res.sendFile('./public/registration/registration.html', { root: './Project' });
});

router.post('/user', async (req, res, next) => {
  const validationResult = ajv.validate(AddUserSchema, req.body);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
},

async (req, res) => {
  const result = await authenticationController.registerUser(req.body);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
