import jwt from 'jsonwebtoken';

const { sign, verify } = jwt;

class JwtService {
  async createSign(patientID, tokenKey = process.env.TOKEN_KEY) {
    try {
      const token = sign({
        user_id: patientID,
      }, tokenKey);
      return token;
    } catch (e) {
      console.log(e.message);
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

export { JwtService };
