import express from 'express';
import Ajv from 'ajv';
import { queueController } from '../api/controllers/queueController.js';
import { resolutionController } from '../api/controllers/resolutionController.js';
import { AddPatientSchema } from '../api/schems/AddPatientSchema.js';
import { GetPatientSchema } from '../api/schems/GetPatientSchema.js';
import { STATUSES } from '../api/constants.js';

const router = express();
const ajv = new Ajv();

router.get('/', (req, res) => {
  res.sendFile('./public/queue.html', { root: './Project' });
});

router.post('/add-patient', (req, res, next) => {
  const validationResult = ajv.validate(AddPatientSchema, req.body);
  if (validationResult) {
    next();
  } else {
    res.status(STATUSES.BadRequest).send(JSON.stringify('N/A'));
  }
},(req, res) => {
  const result = queueController.addValueInQueue(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/current', (req, res) => {
  const result = queueController.getCurrentInQueue();
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/all-value', (req, res) => {
  const result = resolutionController.getAllProcessedPatientsValue();
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/resolution', (req, res, next) => {
  const validationResult = ajv.validate(GetPatientSchema, req.query);
  if (validationResult) {
    next();
  } else {
    res.status(STATUSES.BadRequest).send(JSON.stringify('N/A'));
  }
},(req, res) => {
  const result = resolutionController.findResolution(req.query.value);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

export default router;
