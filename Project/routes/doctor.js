import express from 'express';
import Ajv from 'ajv';

import { injector } from '../Injector.js';
import { SetResolutionSchema } from '../api/schems/SetResolutionSchema.js';
import { DeleteResolutionSchema } from '../api/schems/DeleteResolutionSchema.js';
import { GetPatientSchema } from '../api/schems/GetPatientSchema.js';
import { STATUSES, NOT_AVAILABLE } from '../constants.js';

const router = express();
const ajv = new Ajv();
const queueController = injector.getQueueController;
const resolutionController = injector.getResolutionController;

router.get('/', (req, res) => {
  res.sendFile('./public/doctor.html', { root: './Project' });
});

router.get('/patient/current', async (req, res) => {
  const result = await queueController.getCurrentInQueue();
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/patient/next', async (req, res) => {
  const result = await queueController.takeNextValueInQueue();
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/patient/:value/resolution', async (req, res, next) => {
  const validationResult = ajv.validate(GetPatientSchema, req.params);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BadRequest).send(JSON.stringify(NOT_AVAILABLE));
  }
},

async (req, res) => {
  const result = await resolutionController.findResolution(req.params.value);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.put('/patient/current/resolution', async (req, res, next) => {
  const validationResult = ajv.validate(SetResolutionSchema, req.body);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BadRequest).send(JSON.stringify(NOT_AVAILABLE));
  }
},

async (req, res) => {
  const result = await resolutionController.setResolutionForCurrentPatient(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.delete('/patient/:value/resolution', async (req, res, next) => {
  const validationResult = ajv.validate(DeleteResolutionSchema, req.params);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BadRequest).send(JSON.stringify(NOT_AVAILABLE));
  }
},

async (req, res) => {
  const result = await resolutionController.deleteResolution(req.params.value);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

export default router;
