import express from 'express';
import doctorRouter from './routes/doctor.js';
import queueRouter from './routes/queue.js';
import mainRouter from './routes/main.js';
import loginRouter from './routes/login.js';
import registerRouter from './routes/registration.js';
import { createServer } from './websocketServer.js';
import { envConfig } from './config.js';

const app = express();

app.use(express.static('./Project/public'));
app.use(express.static('./Project/api'));

app.use(express.json({ strict: false }));

app.use('/doctor', doctorRouter);
app.use('/queue', queueRouter);
app.use('/', mainRouter);
app.use('/login', loginRouter);
app.use('/registration', registerRouter);

app.listen(envConfig.app.port, () => {
  createServer();
  console.log(`Express web app available at localhost: ${envConfig.app.port}`);
});
