import express from 'express';
import { injector } from '../../../Injector';
import {
  addInQueueMiddleware,
  authenticationMiddleware,
  checkIDMiddleware,
} from '../../helpers/middleware';

const router = express();
const queueController = injector.getQueueController;

router.post('/queue/:queueID/patient/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  addInQueueMiddleware(req, res, next);
}, async (req, res) => {
  const result = await queueController.addValueInQueue(req.userID, req.params.queueID);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/queue/me/current', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await queueController.getCurrentInMyQueue(req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/queue/:id/current', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await queueController.getCurrentInQueue(req.params.id);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/queue/me/next', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const shift = await queueController.takeNextValueInQueue(req.userID);
  res.status(shift.getStatus).json(shift.getValue);
});

export default router;
