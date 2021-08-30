import express from 'express';

const router = express();

router.get('/', (req, res) => {
  res.redirect('/queue');
});

export default router;
