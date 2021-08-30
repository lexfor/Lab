import express from 'express';
import Ajv from 'ajv';
import { injector } from '../Injector.js';
import { AddPatientSchema } from '../api/helpers/schemas/AddPatientSchema.js';
import { GetPatientSchema } from '../api/helpers/schemas/GetPatientSchema.js';
import { STATUSES, NOT_AVAILABLE } from '../constants.js';

const router = express();
const ajv = new Ajv();
const queueController = injector.getQueueController;
const resolutionController = injector.getResolutionController;

router.get('/', (req, res) => {
  res.sendFile('./public/queue.html', { root: './Project' });
});

router.post('/patient', async (req, res, next) => {
  const validationResult = ajv.validate(AddPatientSchema, req.body);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
  }
},

async (req, res) => {
  const result = await queueController.addValueInQueue(req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/patient/current', async (req, res) => {
  const result = await queueController.getCurrentInQueue();
  res.status(result.getStatus).json(result.getValue);
});

router.get('/patient/all', async (req, res) => {
  const result = await resolutionController.getAllPatientsNames();
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
  const result = await resolutionController.findResolutionByPatientName(req.query.value);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
