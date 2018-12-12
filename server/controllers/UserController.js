import HelperUtils from '../utils/HelperUtils';

/**
 * @class UserController
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports UserController
 */

class UserController {
  /**
  * @method registerUser
  * @description Registers a user if details are correct
  * @param {object} req - The Request Object
  * @param {object} res - The Response Object
  * @returns {object} JSON API Response
  */
  static registerUser(req, res) {
    const token = HelperUtils.generateToken(req.body);
    res.status(201).json({ status: 201, data: [{ message: 'Registration Successful!', token }] });
  }

  /**
   * @method loginUser
   * @description Logs in a user if details are correct
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static loginUser(req, res) {
    const token = HelperUtils.generateToken(req.body);
    res.status(200).json({ status: 200, data: [{ message: 'Login Successful!', token }] });
  }
}

export default UserController;
