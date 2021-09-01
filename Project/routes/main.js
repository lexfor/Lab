import express from 'express';

const router = express();

router.get('/', (req, res) => {
  res.redirect('/login');
});

export default router;
