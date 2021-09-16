import express from 'express';

const router = express();

router.get('/', (req, res) => {
  res.sendFile('./public/doctor-login/login.html', { root: './Project' });
});

export default router;
