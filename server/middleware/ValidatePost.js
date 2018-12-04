import validate from '../utils/validationHelper';
import postDb from '../models/posts';

/**
 * @class ValidatePost
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports ValidatePost
 * @param {req} : The request object sent in the body
 * @param {res} : The reponse object sent by the server to the user
 */

class ValidatePost {
  static validateCoordinates(req, res, next) {
    let error = '';
    const { latitude, longitude } = req.body;

    if (!latitude) {
      error = 'Latitude of the incident location must be specified';
    }
    if (!validate.location.test(latitude)) {
      error = 'Latitude must be in a valid format';
    }
    if (!longitude) {
      error = 'Longitude of the incident location must be specified';
    }
    if (!validate.location.test(longitude)) {
      error = 'Longitude must be in a valid format';
    }

    if (error) {
      return res.status(406).json({ status: 406, error });
    }

    return next();
  }

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

  static validateComment(req, res, next) {
    let error = '';
    const { comment } = req.body;

    if (!comment) {
      error = 'A comment narrating the incident must be specified';
    }
    if (comment.length < 20) {
      error = 'Your comment/narration should be from 20 characters above';
    }

    if (error) {
      return res.status(406).json({ status: 406, error });
    }

    return next();
  }

  static validatePostType(req, res, next) {
    let error = '';
    const { type } = req.body;

    if (!type) {
      error = 'A record type of either red-flag or intervention must be specified';
    }
    if (type !== 'red-flag' && type !== 'intervention') {
      error = 'A valid record type of either must be specified';
    }

    if (error) {
      return res.status(406).json({ status: 406, error });
    }


    return next();
  }
}

export default ValidatePost;
