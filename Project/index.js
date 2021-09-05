import express from 'express';
import doctorRouter from './routes/doctor';
import queueRouter from './routes/queue';
import mainRouter from './routes/main';
import loginRouter from './routes/login';
import registerRouter from './routes/registration';
import { createServer } from './websocketServer';
import { envConfig } from './config';

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
