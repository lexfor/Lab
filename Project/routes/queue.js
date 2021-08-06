import express from 'express';
import * as queue from '../api/controllers/queueController.js';
import * as resolution from '../api/controllers/resolutionController.js';

const router = express();

router.get('/', (req, res) => {
  res.sendFile('./public/queue.html', { root: '../Project' });
});

router.post('/add_patient', (req, res) => {
  const result = queue.addInQueue(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/get_current', (req, res) => {
  const result = queue.getCurrentInQueue();
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.get('/get_all_value', (req, res) => {
  const result = resolution.getAll();
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.post('/get_resolution', (req, res) => {
  const result = resolution.getResolution(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

export default router;
