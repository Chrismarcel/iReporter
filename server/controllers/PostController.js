import postDb from '../models/posts';

/**
 * @class PostController
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports PostController
 * @param {req} : The request object sent in the body
 * @param {res} : The reponse object sent by the server to the user
 */

class PostController {
  /**
   * @method postRecord : Adds a new record (resource) to the collection
   */
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

    postDb.push(recordData);

    res.status(201).json({
      status: 201,
      data: [{ id, message: `Created ${type} successfully` }],
    });
  }
}

export default PostController;
