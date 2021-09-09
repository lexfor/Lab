import express from 'express';

const router = express();

router.get('/doctor', (req, res) => {
  res.sendFile('./public/doctor/doctor.html', { root: './Project' });
});

export default router;
