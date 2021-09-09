import jwt from 'jsonwebtoken';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

const { sign, verify } = jwt;

class JwtService {
  async createSign(userID, tokenKey = process.env.TOKEN_KEY) {
    try {
      const token = sign({
        user_id: userID,
      }, tokenKey);
      return { jwt: token, user_id: userID };
    } catch (e) {
      throw new ApiError('wrong sign', STATUSES.SERVER_ERROR);
    }
  }

  verifySign(token) {
    try {
      const patientID = verify(token, process.env.TOKEN_KEY);
      return patientID;
    } catch (e) {
      throw new ApiError('wrong token', STATUSES.FORBIDDEN);
    }
  }
}

export { JwtService };
