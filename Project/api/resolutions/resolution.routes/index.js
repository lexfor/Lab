import express from 'express';
import Ajv from 'ajv';

import { injector } from '../../../Injector';
import { SetResolutionSchema } from '../../helpers/schemas/SetResolutionSchema';
import { DeleteResolutionSchema } from '../../helpers/schemas/DeleteResolutionSchema';
import { GetPatientSchema } from '../../helpers/schemas/GetPatientSchema';
import { STATUSES, NOT_AVAILABLE } from '../../../constants';
import { UserSchema } from '../../helpers/schemas/UserSchema';

const router = express();
const ajv = new Ajv();
const resolutionController = injector.getResolutionController;
const authenticationController = injector.getAuthenticationController;

router.get('/doctor', (req, res) => {
  res.sendFile('./public/doctor/doctor.html', { root: './Project' });
});

router.get('/resolution', async (req, res, next) => {
  if (req.query.name) {
    const validationResult = ajv.validate(GetPatientSchema, req.query);
    if (validationResult) {
      await next();
    } else {
      res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
    }
  } else {
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
  }
}, async (req, res) => {
  if (req.query.name) {
    const result = await resolutionController.findResolution(req.query);
    res.status(result.getStatus).json(result.getValue);
  } else {
    const result = await resolutionController.findResolution({
      user_id: req.token.user_id,
    });
    res.status(result.getStatus).json(result.getValue);
  }
});

router.put('/resolution', async (req, res, next) => {
  const validationResult = ajv.validate(SetResolutionSchema, req.body);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}, async (req, res) => {
  const result = await resolutionController.setResolution(req.body.value, req.body.id);
  res.status(result.getStatus).json(result.getValue);
});

router.delete('/resolution', async (req, res, next) => {
  const validationResult = ajv.validate(DeleteResolutionSchema, req.query);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}, async (req, res) => {
  const result = await resolutionController.deletePatientResolution(req.query.patient_id);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
