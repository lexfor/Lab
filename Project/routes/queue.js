import express from 'express';
import Clinic from '../api/controllers/ClinicController.js';

const router = express();

const clinic = new Clinic();

router.get('/', (req, res) => {
  res.sendFile('./public/queue.html', { root: '../Project' });
});

router.post('/add_patient', (req, res) => {
  const result = clinic.push(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/get_current', (req, res) => {
  const result = clinic.getCurrentValue(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/get_all_value', (req, res) => {
  const result = clinic.getAllValue();
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.post('/get_resolution', (req, res) => {
  const result = clinic.findResolution(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

export default router;
