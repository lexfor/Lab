import express from 'express';
import Clinic from '../api/controllers/ClinicController.js';

const router = express();

const clinic = new Clinic();

router.get('/', (req, res) => {
  res.sendFile('./public/doctor.html', { root: '../Project' });
});

router.post('/next', (req, res) => {
  const result = clinic.next(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.post('/set_resolution', (req, res) => {
  const result = clinic.setCurrentResolution(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.post('/delete_resolution', (req, res) => {
  const result = clinic.deleteResolution(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

export default router;
