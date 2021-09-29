import jwt from 'jsonwebtoken';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

const { sign, verify } = jwt;

class JwtService {
  /**
   * Create jwt sign by user ID
   * @param {string} userID
   * @param {string} tokenKey
   * @returns {object} jwt token
   */
  createSign(userID, tokenKey = process.env.TOKEN_KEY) {
    try {
      const token = sign({
        userID,
      }, tokenKey);
      return { jwt: token };
    } catch (e) {
      throw new ApiError('wrong sign', STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Verify jwt token
   * @param {string} token
   * @returns {string} userID
   */
  verifySign(token) {
    try {
      const userID = verify(token, process.env.TOKEN_KEY);
      return userID;
    } catch (e) {
      throw new ApiError('wrong token', STATUSES.FORBIDDEN);
    }
  }
}

export { JwtService };
