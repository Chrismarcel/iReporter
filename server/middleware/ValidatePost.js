import validate from '../utils/validationHelper';

class ValidatePost {
  static validatePostRecord(req, res, next) {
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
}

export default ValidatePost;
