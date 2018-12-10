import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET_KEY;

/**
 * @class AuthenticateUser
 * @description Intercepts and validates a given request for user endpoints
 * @exports AuthenticateUser
 */
class AuthenticateUser {
  /**
   * @method generateToken
   * @description Generates JWT upon user registration or login
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {string} - The token string
   */
  static generateToken(req, res, next) {
    jwt.sign(req.body, secretKey, { expiresIn: '2 minutes' }, (err, token) => {
      req.token = token;
      return next();
    });
  }

  /**
   * @method verifyToken
   * @description Verifies the token provided by the user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} - JSON response object
   */
  static verifyToken(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({
        status: 401,
        error: 'You need to provide a token to make a request on this endpoint',
      });
    }

    const token = req.headers.authorization.split(' ')[1];

    return jwt.verify(token, secretKey, (err) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          error: 'Sorry, the provided token cannot be authenticated.',
        });
      }
      return next();
    });
  }
}

export default AuthenticateUser;
