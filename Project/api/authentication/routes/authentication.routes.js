import express from 'express';
import { injector } from '../../../Injector';
import { addUserMiddleware, loginMiddleware } from '../../helpers/middleware';
import { ROLES } from '../../../constants';

const router = express();
const authenticationController = injector.getAuthenticationController;

router.post('/registration', async (req, res, next) => {
  addUserMiddleware(req, res, next);
}, async (req, res) => {
  const result = await authenticationController.registerUser(req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.post('/patient/login', async (req, res, next) => {
  loginMiddleware(req, res, next);
}, async (req, res) => {
  const result = await authenticationController.login(req.body, ROLES.PATIENT);
  res.status(result.getStatus).json(result.getValue);
});

router.post('/doctor/login', async (req, res, next) => {
  loginMiddleware(req, res, next);
}, async (req, res) => {
  const result = await authenticationController.login(req.body, ROLES.DOCTOR);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
