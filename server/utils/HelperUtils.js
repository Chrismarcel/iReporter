import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const secretKey = process.env.SECRET_KEY;

class HelperUtils {
  static validate() {
    return {
      name: /^[a-zA-Z]+$/,
      email: /^([A-z0-9-_.]+)@([A-z0-9-_.]+)\.([A-z]{2,3})$/,
      phonenumber: /^\+[0-9]{13}$|^[0-9]{11}$/,
      location: /^([0-9]+)[.]([0-9]+)$/,
      username: /^([0-9]|[A-z]|[.\-_])+$/,
    };
  }

  static generateToken(payload) {
    const token = jwt.sign(payload, secretKey, { expiresIn: '2 minutes' });
    return token;
  }

  static verifyToken(token) {
    try {
      const payload = jwt.verify(token, secretKey);
      return payload;
    } catch (error) {
      return false;
    }
  }

  static hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }
}

export default HelperUtils;
