import validate from '../utils/validationHelper';
import postDb from '../models/posts';

/**
 * @class ValidatePost
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports ValidatePost
 */

class ValidatePost {
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
      return res.status(406).json({
        status: 406, error, isLatitude: latitude, isLongitude: longitude,
      });
    }

    return next();
  }

  /**
   * @method validatePostId
   * @description Validates the specific ID passed in the request body exists in the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static validatePostId(req, res, next) {
    const records = postDb.filter(recordObj => recordObj.id === Number(req.params.id));

    if (Number.isNaN(Number(req.params.id))) {
      return res.status(406).json({ status: 406, error: 'The id parameter must be a number' });
    }
    if (!records.length) {
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
      return res.status(406).json({ status: 406, error });
    }

    return next();
  }

  /**
   * @method validatePostType
   * @description Validates the specified post type is either an intervention or red-flag record
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static validatePostType(req, res, next) {
    let error = '';
    const { type } = req.body;

    if (!type) {
      error = 'A record type of either red-flag or intervention must be specified';
    } else if (type !== 'red-flag' && type !== 'intervention') {
      error = 'A valid record type of either red-flag or intervention must be specified';
    }

    if (error) {
      return res.status(406).json({ status: 406, error });
    }


    return next();
  }
}

export default ValidatePost;
