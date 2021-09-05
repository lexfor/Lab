import express from 'express';
import Ajv from 'ajv';
import { injector } from '../Injector';
import { STATUSES, NOT_AVAILABLE } from '../constants';
import { UserSchema } from '../api/helpers/schemas/UserSchema';

const router = express();
const ajv = new Ajv();
const queueController = injector.getQueueController;
const resolutionController = injector.getResolutionController;
const authenticationController = injector.getAuthenticationController;

router.get('/', (req, res) => {
  res.sendFile('./public/queue/queue.html', { root: './Project' });
});

router.post('/patient', async (req, res, next) => {
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

router.get('/patient/current', async (req, res) => {
  const result = await queueController.getCurrentInQueue();
  res.status(result.getStatus).json(result.getValue);
});

router.get('/patient/resolution', async (req, res, next) => {
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
  const result = await resolutionController.findResolution({
    user_id: req.token.user_id,
  });
  res.status(result.getStatus).json(result.getValue);
});

export default router;
