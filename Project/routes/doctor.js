import express from 'express';
import Ajv from 'ajv';
import { SetResolutionSchema } from '../api/schems/SetResolutionSchema.js';
import { DeleteResolutionSchema } from '../api/schems/DeleteResolutionSchema.js';
import { queueController } from '../api/controllers/queueController.js';
import { resolutionController } from '../api/controllers/resolutionController.js';
import { STATUSES } from '../api/constants.js';

const router = express();
const ajv = new Ajv();

router.get('/', (req, res) => {
  res.sendFile('./public/doctor.html', { root: './Project' });
});

router.get('/next', (req, res) => {
  const result = queueController.takeNextValueInQueue();
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.post('/set-resolution', (req, res, next) => {
  const validationResult = ajv.validate(SetResolutionSchema, req.body);
  if (validationResult) {
    next();
  } else {
    res.status(STATUSES.BadRequest).send(JSON.stringify('N/A'));
  }
},

(req, res) => {
  const result = resolutionController.setResolutionForCurrentPatient(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.delete('/resolution', (req, res, next) => {
  const validationResult = ajv.validate(DeleteResolutionSchema, req.query);
  if (validationResult) {
    next();
  } else {
    res.status(STATUSES.BadRequest).send(JSON.stringify('N/A'));
  }
},

(req, res) => {
  const result = resolutionController.deleteResolution(req.query.value);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

export default router;
