import express from 'express';

const router = express();

router.get('/', (req, res) => {
  res.sendFile('./public/queue/queue.html', { root: './Project' });
});

export default router;
