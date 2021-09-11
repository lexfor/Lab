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

router.get('/patient/resolution', async (req, res, next) => {
  const validationResult = ajv.validate(GetPatientSchema, req.query);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}, async (req, res) => {
  const result = await resolutionController.findResolution(req.query);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/patient/:id/resolution', async (req, res, next) => {
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
  const result = await resolutionController.findResolution({
    user_id: req.params.id,
  });
  res.status(result.getStatus).json(result.getValue);
});

router.put('/patient/:id/resolution', async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(STATUSES.FORBIDDEN).json(NOT_AVAILABLE);
  }

  const auth = authHeader.split(' ')[1];
  const { value: { user_id: userID } } = await authenticationController.checkToken(auth);
  const [{ firstName, specializationName }] = await injector.doctorRepository.getDoctorByID(userID);
  req.data = { firstName, specializationName };

  const validationResult = ajv.validate(SetResolutionSchema, req.body);
  const validationUserResult = ajv.validate(UserSchema, req.params);
  if (validationResult && validationUserResult) {
    next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}, async (req, res) => {
  const result = await resolutionController.setResolution(req.body, req.params, req.data);
  res.status(result.getStatus).json(result.getValue);
});

router.delete('/resolution/:id', async (req, res, next) => {
  const validationResult = ajv.validate(DeleteResolutionSchema, req.params);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}, async (req, res) => {
  const result = await resolutionController.deletePatientResolution(req.params);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
