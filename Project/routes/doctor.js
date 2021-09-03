import express from 'express';
import Ajv from 'ajv';

import { injector } from '../Injector.js';
import { SetResolutionSchema } from '../api/helpers/schemas/SetResolutionSchema.js';
import { DeleteResolutionSchema } from '../api/helpers/schemas/DeleteResolutionSchema.js';
import { GetPatientSchema } from '../api/helpers/schemas/GetPatientSchema.js';
import { STATUSES, NOT_AVAILABLE } from '../constants.js';

const router = express();
const ajv = new Ajv();
const queueController = injector.getQueueController;
const resolutionController = injector.getResolutionController;

router.get('/', (req, res) => {
  res.sendFile('./public/doctor/doctor.html', { root: './Project' });
});

router.get('/patient/current', async (req, res) => {
  const result = await queueController.getCurrentInQueue();
  res.status(result.getStatus).json(result.getValue);
});

router.get('/patient/next', async (req, res) => {
  const result = await queueController.takeNextValueInQueue();
  res.status(result.getStatus).json(result.getValue);
});

router.get('/patient/resolution', async (req, res, next) => {
  const validationResult = ajv.validate(GetPatientSchema, req.query);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
},

async (req, res) => {
  const result = await resolutionController.findResolution(req.query);
  res.status(result.getStatus).json(result.getValue);
});

router.put('/patient/current/resolution', async (req, res, next) => {
  const validationResult = ajv.validate(SetResolutionSchema, req.body);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
},

async (req, res) => {
  const result = await resolutionController.setResolution(req.body.value, req.body.id);
  res.status(result.getStatus).json(result.getValue);
});

router.delete('/patient/resolution', async (req, res, next) => {
  const validationResult = ajv.validate(DeleteResolutionSchema, req.query);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
},

async (req, res) => {
  const result = await resolutionController.deletePatientResolution(req.query.patient_id);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
