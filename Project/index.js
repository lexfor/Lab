import express from 'express';
import doctorRouter from './routes/doctor.js';
import queueRouter from './routes/queue.js';
import mainRouter from './routes/main.js';

import { envConfig } from './config.js';

const app = express();

app.use(express.static('./Project/public'));
app.use(express.static('./Project/api'));

app.use(express.json({ strict: false }));

app.use('/doctor', doctorRouter);
app.use('/queue', queueRouter);
app.use('/', mainRouter);

app.listen(envConfig.app.port, () => {
  console.log(`Express web app available at localhost: ${envConfig.app.port}`);
});
