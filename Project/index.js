import express from 'express';
import patientRouter from './api/patient/routes/patient.routes';
import loginRouter from './routes/login';
import registrationRouter from './routes/registration';
import queueRouter from './routes/queue';
import resolutionRouter from './api/resolutions/routes/resolution.routes';
import authenticationRouter from './api/authentication/routes/authentication.routes';
import doctorRouter from './api/doctor/routes';
// import { createServer } from './websocketServer';
import { envConfig } from './config';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/patient/login');
});

try {
  app.use('/queue/', express.static('./Project/public/queue'));
  app.use('/queue', queueRouter);

  app.use('/patient/login', express.static('./Project/public/patient-login/'));
  app.use('/patient/login', loginRouter);

  app.use('/doctor/login', express.static('./Project/public/doctor-login/'));
  app.use('/doctor/', express.static('./Project/public/doctor/'));
  app.use('/doctor', doctorRouter);

  app.use('/registration', express.static('./Project/public/registration'));
  app.use('/registration', registrationRouter);

  app.use('/', patientRouter);
  app.use('/', resolutionRouter);
  app.use('/', authenticationRouter);
} catch (error) {
  console.log(error);
}

app.listen(envConfig.app.port, () => {
  // createServer();
  console.log(`Express web app available at http://localhost:${envConfig.app.port}`);
});
