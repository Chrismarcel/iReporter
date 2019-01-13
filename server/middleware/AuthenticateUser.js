import HelperUtils from '../utils/HelperUtils';

/**
 * @class AuthenticateUser
 * @description Authenticates a given user
 * @exports AuthenticateUser
 */
class AuthenticateUser {
  /**
   * @method verifyAuthHeader
   * @description Verifies that the authorization was set
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} - JSON response object
   */
  static verifyAuthHeader(req) {
    if (!req.headers.authorization) {
      return { error: 'auth' };
    }
    const token = req.headers.authorization.split(' ')[1];
    const payload = HelperUtils.verifyToken(token);

    if (!payload) {
      return { error: 'token' };
    }

    return payload;
  }

  /**
   * @method verifyUser
   * @description Verifies the token provided by the user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} - JSON response object
   */
  static verifyUser(req, res, next) {
    const incidentTypes = ['red-flags', 'interventions'];

    if (!incidentTypes.includes(req.params.incidentType)) {
      return res.status(404).json({ status: 404, error: 'Such endpoint does not exist' });
    }
    const payload = AuthenticateUser.verifyAuthHeader(req);
    let error;
    let status;

    if (payload && payload.error === 'auth') {
      status = 401;
      error = 'No authorization header was specified';
    } else if (payload && payload.error === 'token') {
      status = 401;
      error = 'The provided token cannot be authenticated.';
    }

    if (error) {
      return res.status(status).json({ status, error });
    }

    req.user = payload;
    return next();
  }

  /**
   * @method verifyAdmin
   * @description Verifies the token provided by the Admin
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} - JSON response object
   */
  static verifyAdmin(req, res, next) {
    const incidentTypes = ['red-flags', 'interventions'];
    const status = ['drafted', 'investigating', 'resolved', 'rejected'];
    const payload = AuthenticateUser.verifyAuthHeader(req);
    const { isadmin } = payload;

    if (!isadmin) {
      return res.status(401).json({
        status: 401,
        error: 'You are not authorized to access this endpoint.',
      });
    }

    if (!incidentTypes.includes(req.params.incidentType)) {
      return res.status(404).json({ status: 404, error: 'Such endpoint does not exist' });
    }
    if (!status.includes(req.body.status)) {
      return res.status(401).json({ status: 401, error: 'You are trying to update an unknown status' });
    }

    return next();
  }
}

export default AuthenticateUser;
