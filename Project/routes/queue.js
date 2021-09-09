import express from 'express';

const router = express();

router.get('/queue', (req, res) => {
  res.sendFile('./public/queue/queue.html', { root: './Project' });
});

export default router;
