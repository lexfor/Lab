import express from 'express';
import patientRouter from './api/patient/routes/patient.routes';
import loginRouter from './routes/login';
import registrationRouter from './routes/registration';
import doctorRouter from './routes/doctor';
import queueRouter from './routes/queue';
import resolutionRouter from './api/resolutions/routes/resolution.routes';
import authenticationRouter from './api/authentication/routes/authentication.routes';
import { createServer } from './websocketServer';
import { envConfig } from './config';

const app = express();

app.use(express.static('./Project/public'));
app.use(express.static('./Project/api'));

app.use(express.json({ strict: false }));

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.use('/', patientRouter);
app.use('/', resolutionRouter);
app.use('/', authenticationRouter);
app.use('/', loginRouter);
app.use('/', registrationRouter);
app.use('/', doctorRouter);
app.use('/', queueRouter);

app.listen(envConfig.app.port, () => {
  createServer();
  console.log(`Express web app available at localhost: ${envConfig.app.port}`);
});
