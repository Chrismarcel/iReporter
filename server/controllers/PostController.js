import postDb from '../models/posts';

/**
 * @class PostController
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports PostController
 * @param {req} : The request object sent in the body
 * @param {res} : The reponse object sent by the server to the user
 */

class PostController {
  static getRecords(req, res) {
    res.status(200).json({ status: 200, data: [...postDb] });
  }

  static getARecord(req, res) {
    const data = postDb.filter(recordObj => Number(req.params.id) === recordObj.id);
    res.status(200).json({ status: 200, data });
  }

  static postRecord(req, res) {
    const {
      type, comment, latitude, longitude,
    } = req.body;

    const id = postDb.length + 1;
    const recordData = {
      id,
      comment,
      type,
      location: `${latitude}, ${longitude}`,
      createdOn: new Date(),
      createdBy: 8,
      status: 'drafted',
      images: [],
      videos: [],
    };

    postDb.concat(recordData);

    res.status(201).json({
      status: 201,
      data: [{ id, message: `Created ${type} successfully` }],
    });
  }

  static updateLocation(req, res) {
    const record = postDb.filter(recordObj => recordObj.id === Number(req.params.id));
    const { latitude, longitude } = req.body;
    const id = Number(req.params.id);

    Object.assign({}, record[0], { location: `${latitude}, ${longitude}` });

    res.status(200).json({
      status: 200, data: [{ id, message: 'Updated red-flag record\'s location' }],
    });
  }

  static updateComment(req, res) {
    const record = postDb.filter(recordObj => recordObj.id === Number(req.params.id));
    const { comment } = req.body;
    const id = Number(req.params.id);

    Object.assign({}, record[0], { comment });

    res.status(200).json({
      status: 200, data: [{ id, message: 'Updated red-flag record\'s location' }],
    });
  }
}

export default PostController;
