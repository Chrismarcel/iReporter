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
      data: [{ id, message: `Created ${type} record` }],
    });
  }

  static updateLocation(req, res) {
    const record = postDb.filter(recordObj => recordObj.id === Number(req.params.id));
    const { latitude, longitude } = req.body;
    const id = Number(req.params.id);

    // Use Object.assign so as not to mutate existing records object
    Object.assign({}, record[0], { location: `${latitude}, ${longitude}` });

    res.status(200).json({
      status: 200, data: [{ id, message: 'Updated red-flag record\'s location' }],
    });
  }

  static updateComment(req, res) {
    const id = Number(req.params.id);
    const record = postDb.filter(recordObj => recordObj.id === Number(id));
    const { comment } = req.body;

    // Use Object.assign so as not to mutate existing records object
    Object.assign({}, record[0], { comment });

    res.status(200).json({
      status: 200, data: [{ id, message: 'Updated red-flag record\'s comment' }],
    });
  }

  static deleteRecord(req, res) {
    const id = Number(req.params.id);

    // Use filter so as not to mutate array
    postDb.filter(recordObj => recordObj.id !== Number(id));

    res.status(200).json({
      status: 200, data: [{ id, message: 'red-flag record has been deleted' }],
    });
  }
}

export default PostController;
