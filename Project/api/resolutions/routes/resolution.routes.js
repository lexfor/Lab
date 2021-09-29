import express from 'express';

import { injector } from '../../../Injector';
import {
  authenticationMiddleware,
  checkIDMiddleware,
  checkResolutionMiddleware,
} from '../../helpers/middleware';

const router = express();
const resolutionController = injector.getResolutionController;

router.get('/resolutions/patient/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await resolutionController.getPatientResolutions(req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.put('/resolution/patient/:id', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  checkResolutionMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.addResolution(req.body, req.params, req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/resolutions/patient/:id', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.getAllResolutions(req.params.id);
  res.status(result.getStatus).json(result.getValue);
});

router.delete('/resolution/:id', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.deletePatientResolution(req.params.id);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
