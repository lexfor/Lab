import express from 'express';
import bodyParser from 'body-parser';

import doctorRouter from './routes/doctor.js';
import queueRouter from './routes/queue.js';

const app = express();
const port = 3000;

app.use(express.static('./public'));
app.use(express.static('./api'));

app.use(bodyParser.json({ strict: false }));

app.use('/doctor', doctorRouter);
app.use('/', queueRouter);

app.listen(port, () => {
  console.log(`Express web app available at localhost: ${port}`);
});
