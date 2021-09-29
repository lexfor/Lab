import express from 'express';
import { injector } from '../../../Injector';
import { checkIDMiddleware } from '../../helpers/middleware';

const router = express();
const doctorController = injector.getDoctorController;

router.get('/doctor/specializations', async (req, res) => {
  const result = await doctorController.getAllSpecialization();
  res.status(result.getStatus).json(result.getValue);
});

router.get('/doctor/specialization/:id', (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.getAllDoctorsBySpecializations(req.params.id);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
