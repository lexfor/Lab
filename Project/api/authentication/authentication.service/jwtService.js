import jwt from 'jsonwebtoken';

const { sign, verify } = jwt;

export default class JwtService {
  async createSign(patientID) {
    try {
      const token = sign({
        user_id: patientID,
      }, process.env.TOKEN_KEY);
      return token;
    } catch (e) {
      return 'wrong sign';
    }
  }

  verifySign(token) {
    try {
      const patientID = verify(token, process.env.TOKEN_KEY);
      return patientID;
    } catch (e) {
      return 'wrong token';
    }
  }
}
