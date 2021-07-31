import express from 'express';
import add from '../api/controllers/addPatientController.js';
import getCurrent from '../api/controllers/getCurrentController.js';
import getAllValue from '../api/controllers/getAllValueController.js';
import getResolution from '../api/controllers/getResolutionController.js';

const router = express();

router.get('/', (req, res) => {
  res.sendFile('./public/queue.html', { root: '../Project' });
});

router.post('/add_patient', (req, res) => {
  console.log(req.body);
  add(req.body);
  res.send(JSON.stringify(200));
});

router.get('/get_current', (req, res) => {
  res.send(JSON.stringify(getCurrent()));
});

router.get('/get_all_value', (req, res) => {
  res.send(JSON.stringify(getAllValue()));
});

router.post('/get_resolution', (req, res) => {
  res.send(JSON.stringify(getResolution(req.body)));
});

export default router;
