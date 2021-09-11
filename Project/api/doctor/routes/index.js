import express from 'express';
// import Ajv from 'ajv';
import { injector } from '../../../Injector';
// import { STATUSES, NOT_AVAILABLE } from '../../../constants';
// import { UserSchema } from '../../helpers/schemas/UserSchema';

const router = express();
// const ajv = new Ajv();
// const patientController = injector.getPatientController;
// const authenticationController = injector.getAuthenticationController;

router.get('/', async (req, res) => {
  res.sendFile('./public/doctor/doctor.html', { root: './Project' });
});

router.get('/allSpecializations', (req, res) => injector.doctorController.getAllSpetialization(req, res, injector));

router.get('/allDoctorsBySpecializations', (req, res) => injector.doctorController.allDoctorsBySpecializations(req, res, injector));

router
  .get('/login', async (req, res) => {
    res.sendFile('./public/doctor-login/login.html', { root: './Project' });
  })
  .post('/login', (req, res) => injector.doctorController.login(req, res, injector));

export default router;
