import express from 'express';
import bodyParser from 'body-parser';
import doctorRouter from './routes/doctor.js';
import queueRouter from './routes/queue.js';

import { envConfig } from './config.js';

const app = express();
const port = 3000;

app.use(express.static('./Project/public'));
app.use(express.static('./Project/api'));

app.use(bodyParser.json({ strict: false }));

app.use('/doctor', doctorRouter);
app.use('/', queueRouter);

app.listen(envConfig.app.port, () => {
  console.log(`Express web app available at localhost: ${port}`);
});
