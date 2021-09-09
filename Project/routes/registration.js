import express from 'express';

const router = express();

router.get('/registration', (req, res) => {
  res.sendFile('./public/registration/registration.html', { root: './Project' });
});

export default router;
