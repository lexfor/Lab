import express from 'express';
import Ajv from 'ajv';
import { injector } from '../../../Injector';
import { STATUSES, NOT_AVAILABLE } from '../../../constants';
import { UserSchema } from '../../helpers/schemas/UserSchema';

const router = express();
const ajv = new Ajv();
const queueController = injector.getQueueController;
const authenticationController = injector.getAuthenticationController;

router.get('/queue', (req, res) => {
  res.sendFile('./public/queue/queue.html', { root: './Project' });
});

router.post('/queue/patient', async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(STATUSES.FORBIDDEN).json(NOT_AVAILABLE);
  }
  const auth = authHeader.split(' ')[1];
  const user = await authenticationController.checkToken(auth);
  if (user.getStatus !== STATUSES.OK) {
    res.status(user.getStatus).json(user.getValue);
  }
  req.token = user.getValue;
  const validationResult = ajv.validate(UserSchema, req.token);
  if (!validationResult) {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
  next();
}, async (req, res) => {
  const result = await queueController.addValueInQueue(req.token.user_id);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/queue/current', async (req, res) => {
  const result = await queueController.getCurrentInQueue();
  res.status(result.getStatus).json(result.getValue);
});

router.get('/queue/next', async (req, res) => {
  const result = await queueController.takeNextValueInQueue();
  res.status(result.getStatus).json(result.getValue);
});

export default router;
