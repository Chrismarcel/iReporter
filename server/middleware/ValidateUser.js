import validate from '../utils/validationHelper';
import userDb from '../models/users';

/**
 * @class ValidateUser
 * @description Intercepts and validates a given request for user endpoints
 * @exports ValidateUser
 */
class ValidateUser {
  /**
   * @method validateProfile
   * @description Validates profile details of the user upon registration
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static validateProfileDetails(req, res, next) {
    const {
      firstname, lastname, othername, phonenumber, username,
    } = req.body;
    let error = '';

    if (!firstname || !validate.name.test(firstname)) {
      error = 'You need to include a valid first name';
    } else if (!lastname || !validate.name.test(lastname)) {
      error = 'You need to include a valid last name';
    } else if (!phonenumber || !validate.phonenumber.test(phonenumber)) {
      error = 'You need to include a valid phone number';
    } else if (!username || !validate.username.test(username)) {
      error = 'You need to include a valid username';
    } else if (othername && !validate.name.test(othername)) {
      error = 'The other name you provided is invalid';
    }

    if (error) {
      return res.status(400).json({ status: 400, error });
    }

    return next();
  }

  /**
   * @method validateProfile
   * @description Validates login details (email and password) of a user upon login/registration
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static validateLoginDetails(req, res, next) {
    const { email, password } = req.body;
    let error = '';
    let status;

    const userId = userDb.findIndex(user => user.email === email);

    if (!email || !validate.email.test(email)) {
      error = 'The email you provided is invalid';
    } else if (!password) {
      error = 'You need to provide a password';
    } else if (password.length < 8) {
      error = 'Password length must be 8 characters and above';
    }

    if (error) {
      status = 400;
    } else if (userId === -1) {
      status = 404;
      error = 'Sorry, such account does not exist';
    }

    if (status === 400 || status === 404) {
      return res.status(status).json({ status, error });
    }

    return next();
  }
}

export default ValidateUser;
