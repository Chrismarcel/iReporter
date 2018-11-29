import validate from '../utils/validationHelper';
import postDb from '../models/posts';

class ValidatePost {
  static validatePostRequest(req, res, next) {
    const {
      type, latitude, longitude, comment,
    } = req.body;

    if (!type) {
      return res
        .status(406)
        .json({ status: 406, error: 'A record type of either red-flag or intervention must be specified' });
    }
    if (type !== 'red-flag' && type !== 'intervention') {
      return res
        .status(406)
        .json({ status: 406, error: 'A record type of either red-flag or intervention must be specified' });
    }
    if (!latitude) {
      return res
        .status(406)
        .json({ status: 406, error: 'Latitude of the incident location must be specified' });
    }
    if (!validate.location.test(latitude)) {
      return res
        .status(406)
        .json({ status: 406, error: 'Latitude must be in a valid format' });
    }
    if (!longitude) {
      return res
        .status(406)
        .json({ status: 406, error: 'Longitude of the incident location must be specified' });
    }
    if (!validate.location.test(longitude)) {
      return res
        .status(406)
        .json({ status: 406, error: 'Longitude must be in a valid format' });
    }
    if (!comment) {
      return res
        .status(406)
        .json({ status: 406, error: 'A comment narrating the incident must be specified' });
    }
    if (comment.length < 20) {
      return res
        .status(406)
        .json({ status: 406, error: 'Your comment/narration should be from 20 characters above' });
    }
    return next();
  }

  static validateGetRequest(req, res, next) {
    const records = postDb.filter(recordObj => recordObj.id === Number(req.params.id));
    if (Number.isNaN(Number(req.params.id))) {
      return res.status(406).json({ status: 406, error: 'The id parameter must be a number' });
    }
    if (!records.length) {
      return res.status(404).json({ status: 404, error: 'Sorry, no record with such id exists' });
    }
    return next();
  }

  static validateLocation(req, res, next) {
    const { latitude, longitude } = req.body;
    const records = postDb.filter(recordObj => recordObj.id === Number(req.params.id));

    if (Number.isNaN(Number(req.params.id))) {
      return res.status(406).json({ status: 406, error: 'The id parameter must be a number' });
    }
    if (!records.length) {
      return res.status(404).json({ status: 404, error: 'Sorry, no record with such id exists' });
    }
    if (!latitude) {
      return res
        .status(406)
        .json({ status: 406, error: 'Latitude of the incident location must be specified' });
    }
    if (!validate.location.test(latitude)) {
      return res
        .status(406)
        .json({ status: 406, error: 'Latitude must be in a valid format' });
    }
    if (!longitude) {
      return res
        .status(406)
        .json({ status: 406, error: 'Longitude of the incident location must be specified' });
    }
    if (!validate.location.test(longitude)) {
      return res
        .status(406)
        .json({ status: 406, error: 'Longitude must be in a valid format' });
    }
    return next();
  }

  static validateComment(req, res, next) {
    const { comment } = req.body;

    if (!comment) {
      return res
        .status(406)
        .json({ status: 406, error: 'A comment narrating the incident must be specified' });
    }
    if (comment.length < 20) {
      return res
        .status(406)
        .json({ status: 406, error: 'Your comment/narration should be from 20 characters above' });
    }

    return next();
  }
}

export default ValidatePost;
