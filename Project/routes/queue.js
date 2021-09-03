import express from 'express';
import Ajv from 'ajv';
import jwt from 'jsonwebtoken';
import { injector } from '../Injector.js';
import { STATUSES, NOT_AVAILABLE } from '../constants.js';
import { UserSchema } from '../api/helpers/schemas/UserSchema.js';

const { verify } = jwt;
const router = express();
const ajv = new Ajv();
const queueController = injector.getQueueController;
const resolutionController = injector.getResolutionController;

router.get('/', (req, res) => {
  res.sendFile('./public/queue/queue.html', { root: './Project' });
});

router.post('/patient', async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(STATUSES.UNAUTHORISED).json(NOT_AVAILABLE);
  }
  const auth = authHeader.split(' ')[1];
  const user = verify(auth, process.env.TOKEN_KEY);
  const validationResult = ajv.validate(UserSchema, user);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
},

async (req, res) => {
  const authHeader = req.headers.authorization;
  const auth = authHeader.split(' ')[1];
  const user = verify(auth, process.env.TOKEN_KEY);
  const result = await queueController.addValueInQueue(user.id);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/patient/current', async (req, res) => {
  const result = await queueController.getCurrentInQueue();
  res.status(result.getStatus).json(result.getValue);
});

router.get('/patient/resolution', async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(STATUSES.UNAUTHORISED.json(NOT_AVAILABLE));
  }
  const auth = authHeader.split(' ')[1];
  const user = verify(auth, process.env.TOKEN_KEY);
  const validationResult = ajv.validate(UserSchema, user);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
},

async (req, res) => {
  const authHeader = req.headers.authorization;
  const auth = authHeader.split(' ')[1];
  const user = verify(auth, process.env.TOKEN_KEY);
  const result = await resolutionController.findResolution({
    id: user.id,
  });
  res.status(result.getStatus).json(result.getValue);
});

export default router;
