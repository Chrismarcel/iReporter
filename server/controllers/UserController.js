import postDb from '../models/posts';

/**
 * @class UserController
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports UserController
 */

class UserController {
  static registerUser(req, res) {
    const {
      firstname, lastname, othername, email, password, phonenumber, username,
    } = req.body;

    res.status(201).json({ status: 201, data: [{ message: 'Registration Successful!' }] });
  }

  static loginUser(req, res) {
    const { email, password } = req.body;

    res.status(200).json({ status: 200, data: [{ message: 'Login Successful!' }] });
  }
}

export default UserController;
