import express from 'express';
import Clinic from '../api/controllers/ClinicController.js';
import { STATUSES } from './ResultStatuses.js';

const router = express();

const clinic = new Clinic();

router.get('/', (req, res) => {
  res.status(STATUSES.OK).sendFile('./public/doctor.html', { root: '../Project' });
});

router.post('/next', (req, res) => {
  clinic.readFile();
  if (clinic.next()) {
    if (clinic.writeFile()) {
      res.status(STATUSES.OK);
    } else {
      res.status(STATUSES.ServerError);
    }
  } else {
    res.status(STATUSES.Unavaible);
  }
  res.send();
});

router.post('/set_resolution', (req, res) => {
  clinic.readFile();
  clinic.setCurrentResolution(req.body);
  if (clinic.writeFile()) {
    res.status(STATUSES.OK);
  } else {
    res.status(STATUSES.ServerError);
  }
  res.send();
});

router.post('/delete_resolution', (req, res) => {
  clinic.readFile();
  clinic.deleteResolution(req.body);
  if (clinic.writeFile()) {
    res.status(STATUSES.OK);
  } else {
    res.status(STATUSES.ServerError);
  }
  res.send();
});

export default router;
