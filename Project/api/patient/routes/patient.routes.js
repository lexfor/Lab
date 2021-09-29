import express from 'express';
import { injector } from '../../../Injector';
import {
  authenticationMiddleware,
} from '../../helpers/middleware';

const router = express();
const patientController = injector.getPatientController;

router.get('/patients', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await patientController.getAllPatients(req.query.patientInfo);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
