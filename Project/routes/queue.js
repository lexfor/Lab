import express from 'express';
import Ajv from 'ajv';
import { injector } from '../Injector.js';
import { AddPatientSchema } from '../api/schemas/AddPatientSchema.js';
import { GetPatientSchema } from '../api/schemas/GetPatientSchema.js';
import { STATUSES, NOT_AVAILABLE } from '../constants.js';

const router = express();
const ajv = new Ajv();
const queueController = injector.getQueueController;
const resolutionController = injector.getResolutionController;

router.get('/', (req, res) => {
  res.redirect('/queue');
});

router.get('/queue', (req, res) => {
  res.sendFile('./public/queue.html', { root: './Project' });
});

router.post('/queue/patient', async (req, res, next) => {
  const validationResult = ajv.validate(AddPatientSchema, req.body);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).send(JSON.stringify(NOT_AVAILABLE));
  }
},

async (req, res) => {
  const result = await queueController.addValueInQueue(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/queue/patient/current', async (req, res) => {
  const result = await queueController.getCurrentInQueue();
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/queue/patient/all', async (req, res) => {
  const result = await resolutionController.getAllProcessedPatientsNames();
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/queue/patient/resolution', async (req, res, next) => {
  const validationResult = ajv.validate(GetPatientSchema, req.query);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).send(JSON.stringify(NOT_AVAILABLE));
  }
},

async (req, res) => {
  const result = await resolutionController.findResolutionByPatientName(req.query.value);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

export default router;
