import validate from '../utils/validationHelper';
import postDb from '../models/posts';

/**
 * @class ValidateRecord
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports ValidateRecord
 */

class ValidateRecord {
  /**
  * @method validateCoordinates
  * @description Validates the set of co-ordinates passed in the request body
  * @param {object} req - The Request Object
  * @param {object} res - The Response Object
  * @returns {object} JSON API Response
  */
  static validateCoordinates(req, res, next) {
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
   * @method validateRecordId
   * @description Validates the specific ID passed in the request body exists in the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static validateRecordId(req, res, next) {
    if (Number.isNaN(Number(req.params.id))) {
      return res.status(400).json({ status: 400, error: 'The id parameter must be a number' });
    }

    const recordIndex = postDb.findIndex(record => record.id === Number(req.params.id));
    if (recordIndex === -1) {
      return res.status(404).json({ status: 404, error: 'Sorry, no record with such id exists' });
    }

    return next();
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
   * @method validateRecordType
   * @description Validates the specified post type is either an intervention or red-flag record
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static validateRecordType(req, res, next) {
    let error = '';
    const { type } = req.body;

    if (!type) {
      error = 'A record type of either red-flag or intervention must be specified';
    } else if (type !== 'red-flag' && type !== 'intervention') {
      error = 'A valid record type of either red-flag or intervention must be specified';
    }

    if (error) {
      return res.status(400).json({ status: 400, error });
    }

    return next();
  }
}

export default ValidateRecord;
