import express from 'express';
import Ajv from 'ajv';
import { injector } from '../../../Injector';
import { STATUSES, NOT_AVAILABLE } from '../../../constants';
import { UserSchema } from '../../helpers/schemas/UserSchema';

const router = express();
const ajv = new Ajv();
const patientController = injector.getPatientController;
const authenticationController = injector.getAuthenticationController;

router.post('/queue/patient/:id', async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(STATUSES.FORBIDDEN).json(NOT_AVAILABLE);
  }
  const auth = authHeader.split(' ')[1];
  const user = await authenticationController.checkToken(auth);
  if (user.getStatus !== STATUSES.OK) {
    res.status(user.getStatus).json(user.getValue);
  }
  const validationResult = ajv.validate(UserSchema, req.params);
  if (!validationResult) {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  } else {
    next();
  }
}, async (req, res) => {
  const result = await patientController.addValueInQueue(req.params.id);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/queue/current', async (req, res) => {
  const result = await patientController.getCurrentInQueue();
  res.status(result.getStatus).json(result.getValue);
});

router.get('/queue/next', async (req, res) => {
  const result = await patientController.takeNextValueInQueue();
  res.status(result.getStatus).json(result.getValue);
});

export default router;
