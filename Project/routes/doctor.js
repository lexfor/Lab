import express from 'express';
import setNext from '../api/controllers/setNextController.js';
import setResolution from '../api/controllers/setResolutionController.js';
import deleteResolution from '../api/controllers/deleteResolutionController.js';

const router = express();

router.get('/', (req, res) => {
  res.sendFile('./public/doctor.html', { root: '../Project' });
});

router.get('/next', (req, res) => {
  res.send(JSON.stringify(setNext()));
});

router.post('/set_resolution', (req, res) => {
  res.send(JSON.stringify(setResolution(req.body)));
});

router.post('/delete_resolution', (req, res) => {
  res.send(JSON.stringify(deleteResolution(req.body)));
});

export default router;
