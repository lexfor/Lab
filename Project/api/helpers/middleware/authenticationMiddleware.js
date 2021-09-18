import { NOT_AVAILABLE, STATUSES } from '../../../constants';
import { injector } from '../../../Injector';

const authenticationController = injector.getAuthenticationController;

async function authenticationMiddleware(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(STATUSES.FORBIDDEN).json(NOT_AVAILABLE);
  }

  const auth = authHeader.split(' ')[1];
  const user = await authenticationController.checkToken(auth);

  if (user.getStatus !== STATUSES.OK) {
    res.status(user.getStatus).json(user.getValue);
  }
  req.userID = user.getValue.userID;
}

export { authenticationMiddleware };
