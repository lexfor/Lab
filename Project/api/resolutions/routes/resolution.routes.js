import express from 'express';

import { injector } from '../../../Injector';
import { authenticationMiddleware, checkIDMiddleware } from '../../helpers/middleware';

const router = express();
const resolutionController = injector.getResolutionController;

router.delete('/resolution/:id', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.deletePatientResolution(req.params.id);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
