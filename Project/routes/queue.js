import express from 'express';
import Clinic from '../api/controllers/ClinicController.js';
import { STATUSES } from './ResultStatuses.js';

const router = express();

const clinic = new Clinic();

router.get('/', (req, res) => {
  res.status(STATUSES.OK).sendFile('./public/queue.html', { root: '../Project' });
});

router.post('/add_patient', (req, res) => {
  clinic.readFile();
  clinic.push(req.body);
  if (clinic.writeFile()) {
    res.status(STATUSES.OK);
  } else {
    res.status(STATUSES.ServerError);
  }
  res.send();
});

router.get('/get_current', (req, res) => {
  clinic.readFile();
  res.status(STATUSES.OK).send(JSON.stringify(clinic.getCurrentValue()));
});

router.get('/get_all_value', (req, res) => {
  clinic.readFile();
  res.status(STATUSES.OK).send(JSON.stringify(clinic.getAllValue()));
});

router.post('/get_resolution', (req, res) => {
  clinic.readFile();
  res.status(STATUSES.OK).send(JSON.stringify(clinic.findResolution(req.body)));
});

export default router;
