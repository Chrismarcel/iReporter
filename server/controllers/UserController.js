import HelperUtils from '../utils/HelperUtils';
import pool from '../models/dbconnection';

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
    const {
      firstname, lastname, othernames, email, phonenumber, password, username,
    } = req.body;

    const hashedPassword = HelperUtils.hashPassword(password);

    const query = 'INSERT INTO users(firstname, lastname, othernames, email, phonenumber, password, username) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [firstname, lastname, othernames, email, phonenumber, hashedPassword, username];

    pool.query(query, values, (err, dbRes) => {
      const rows = dbRes.rows[0];
      const id = rows.id;
      const email = rows.email;
      const isadmin = rows.isadmin;
      const username = rows.username;
      const firstname = rows.firstname;
      const lastname = rows.lastname;
      const othernames = rows.othernames;
      const phonenumber = rows.phonenumber;

      const token = HelperUtils.generateToken({ id, email, isadmin });
      return res.status(201).json({
        status: 201,
        data: [{
          message: 'Registration Successful!',
          token,
          user: {
            id,
            email,
            firstname,
            lastname,
            username,
            othernames,
            phonenumber,
            isadmin,
          },
        }],
      });
    });
  }

  /**
   * @method loginUser
   * @description Logs in a user if details are correct
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static loginUser(req, res) {
    const token = HelperUtils.generateToken(req.user);

    res.status(200).json({
      status: 200,
      data: [{
        message: 'Login Successful!',
        token,
        user: {
          id: req.user.id,
          email: req.user.email,
          firstname: req.user.firstname,
          lastname: req.user.lastname,
          username: req.user.username,
          phonenumber: req.user.phonenumber,
          isadmin: req.user.isadmin,
        },
      }],
    });
  }
}

export default UserController;
