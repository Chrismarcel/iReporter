import HelperUtils from '../utils/HelperUtils';
import pool from '../models/dbconnection';

/**
 * @class ValidateIncident
 * @description Intercepts and validates a given request for record endpoints
 * @exports ValidateIncident
 */

class ValidateIncident {
  /**
  * @method validateCoordinates
  * @description Validates the set of co-ordinates passed in the request body
  * @param {object} req - The Request Object
  * @param {object} res - The Response Object
  * @returns {object} JSON API Response
  */
  static validateCoordinates(req, res, next) {
    const validate = HelperUtils.validate();
    let error = '';
    const { latitude, longitude } = req.body;

    if (!validate.location.test(longitude)) {
      error = 'Longitude must be in a valid format';
    }
    if (!longitude || longitude === undefined) {
      error = 'Longitude of the incident location must be specified';
    }
    if (!validate.location.test(latitude)) {
      error = 'Latitude must be in a valid format';
    }
    if (!latitude || latitude === undefined) {
      error = 'Latitude of the incident location must be specified';
    }

    if (error) {
      return res.status(400).json({
        status: 400, error,
      });
    }

    return next();
  }

  /**
   * @method validateIncidentId
   * @description Validates the specific ID passed in the request body exists in the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static validateIncidentId(req, res, next) {
    if (Number.isNaN(Number(req.params.id))) {
      return res.status(400).json({ status: 400, error: 'The id parameter must be a number' });
    }

    const query = 'SELECT * FROM incidents WHERE id = $1';
    return pool.query(query, [req.params.id], (err, dbRes) => {
      if (dbRes.rowCount < 1) {
        return res.status(404).json({ status: 404, error: 'Sorry, no record with such id exists' });
      }

      req.postId = dbRes.rows[0].id;
      return next();
    });
  }

  /**
   * @method validateComment
   * @description Ensures comment is not empty or has character length of >= 20
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static validateComment(req, res, next) {
    let error = '';
    const { comment } = req.body;

    if (!comment) {
      error = 'A comment narrating the incident must be specified';
    } else if (comment.length < 20) {
      error = 'Your comment/narration should be from 20 characters above';
    }

    if (error) {
      return res.status(400).json({ status: 400, error });
    }

    return next();
  }

  /**
   * @method validateIncidentType
   * @description Validates the specified post type is either an intervention or red-flag record
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static validateIncidentType(req, res, next) {
    const incidentTypes = ['red-flags', 'interventions'];

    if (!incidentTypes.includes(req.params.incidentType)) {
      return res.status(404).json({ status: 404, error: 'Sorry, such endpoint does not exist' });
    }

    return next();
  }

  /**
   * @method validateStatus
   * @description Validates the status of a given incident report
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static validateStatus(req, res, next) {
    const status = ['investigating', 'resolved', 'rejected'];
    const endpoints = ['location', 'comment'];
    const url = req.url.split('/')[3];

    if (!status.includes(req.body.status) && url === 'status') {
      return res.status(400).json({ status: 400, error: 'You need to specify a correct status type' });
    }

    if (endpoints.includes(url)) {
      const { id } = req.params;
      const query = 'SELECT status FROM incidents WHERE id = $1';

      return pool.query(query, [id], (err, dbRes) => {
        if (dbRes.rows[0].status !== 'drafted') {
          return res.status(409).json({ status: 409, error: 'You cannot modify this report after its status has been updated' });
        }

        return next();
      });
    }

    return next();
  }
}

export default ValidateIncident;
