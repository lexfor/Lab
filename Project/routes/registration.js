import express from 'express';

const router = express();

router.get('/', (req, res) => {
  res.sendFile('./public/registration/registration.html', { root: './Project' });
});

export default router;
