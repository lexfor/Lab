import express from 'express';
import * as queue from '../api/controllers/queueController.js';
import * as resolution from '../api/controllers/resolutionController.js';

const router = express();

router.get('/', (req, res) => {
  res.sendFile('./public/doctor.html', { root: '../Project' });
});

router.post('/next', (req, res) => {
  const result = queue.next(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.post('/set_resolution', (req, res) => {
  const result = resolution.setResolution(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

router.post('/delete_resolution', (req, res) => {
  const result = resolution.deleteResolution(req.body);
  res.status(result.getStatus).send(JSON.stringify(result.getValue));
});

export default router;
