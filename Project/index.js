import express from 'express';
import queueRouter from './api/queue/queue.routes';
import resolutionRouter from './api/resolutions/resolution.routes';
import authenticationRouter from './api/authentication/authentication.routes';
import { createServer } from './websocketServer';
import { envConfig } from './config';

const app = express();

app.use(express.static('./Project/public'));
app.use(express.static('./Project/api'));

app.use(express.json({ strict: false }));

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.use('/', queueRouter);
app.use('/', resolutionRouter);
app.use('/', authenticationRouter);

app.listen(envConfig.app.port, () => {
  createServer();
  console.log(`Express web app available at localhost: ${envConfig.app.port}`);
});
