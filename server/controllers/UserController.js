/**
 * @class UserController
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports UserController
 */

class UserController {
  /**
  * @method getARecord
  * @description Registers a user if details are correct
  * @param {object} req - The Request Object
  * @param {object} res - The Response Object
  * @returns {object} JSON API Response
  */
  static registerUser(req, res) {
    res.status(201).json({ status: 201, data: [{ message: 'Registration Successful!' }] });
  }

  /**
   * @method getARecord
   * @description Logs in a user if details are correct
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static loginUser(req, res) {
    res.status(200).json({ status: 200, data: [{ message: 'Login Successful!' }] });
  }
}

export default UserController;
