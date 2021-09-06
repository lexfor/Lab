import express from 'express';

const router = express();

router.get('/login', (req, res) => {
  res.sendFile('./public/login/login.html', { root: './Project' });
});

export default router;
