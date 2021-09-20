import express from 'express';
import { injector } from '../../../Injector';
import {
  checkResolutionMiddleware,
  authenticationMiddleware,
  checkIDMiddleware,
} from '../../helpers/middleware';

const router = express();
const patientController = injector.getPatientController;
const resolutionController = injector.getResolutionController;

router.get('/patient/me/resolutions', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await resolutionController.findResolution({
    userID: req.userID,
  });
  res.status(result.getStatus).json(result.getValue);
});

router.put('/patient/:id/resolution', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  checkResolutionMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.setResolution(req.body, req.params, req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/patient/:id/resolutions', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.findAllResolutions({
    patientID: req.params.id,
  });
  res.status(result.getStatus).json(result.getValue);
});

router.get('/patients', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await patientController.findAllPatients({
    patientInfo: req.query.patientInfo,
  });
  res.status(result.getStatus).json(result.getValue);
});

export default router;
