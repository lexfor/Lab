import express from 'express';
import Ajv from 'ajv';
import { injector } from '../Injector.js';
import { AddPatientSchema } from '../api/schems/AddPatientSchema.js';
import { GetPatientSchema } from '../api/schems/GetPatientSchema.js';
import { STATUSES } from '../api/constants.js';

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
    res.status(STATUSES.BadRequest).send(JSON.stringify('N/A'));
  }
},

async (req, res) => {
  const result = await queueController.addValueInQueue(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/current', async (req, res) => {
  const result = await queueController.getCurrentInQueue();
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/all-value', async (req, res) => {
  const result = await resolutionController.getAllProcessedPatientsValue();
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/resolution/:value', async (req, res, next) => {
  const validationResult = ajv.validate(GetPatientSchema, req.params);
  if (validationResult) {
    await next();
  } else {
    res.status(STATUSES.BadRequest).send(JSON.stringify('N/A'));
  }
},

async (req, res) => {
  const result = await resolutionController.findResolution(req.params.value);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

export default router;
