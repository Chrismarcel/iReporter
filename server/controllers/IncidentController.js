import pool from '../models/dbconnection';

/**
 * @class IncidentController
 * @description Specifies which method handles a given request for a specific endpoint
 * @exports IncidentController
 */

class IncidentController {
  /**
   * @method getAllIncidents
   * @description Retrieves a list of records
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getAllIncidents(req, res) {
    const { id, isadmin } = req.user;
    const { incidentType } = req.params;
    const type = incidentType.substr(0, incidentType.length - 1);
    let query = 'SELECT * FROM incidents WHERE type = $1';
    let params = [type];

    if (isadmin !== 'true') {
      query += 'AND createdby = $2';
      params = [type, id];
    }

    pool.query(query, params, (err, dbRes) => {
      const resolved = dbRes.rows.filter(report => report.status === 'resolved').length;
      const pending = dbRes.rows.filter(
        report => report.status === 'drafted' || report.status === 'investigating',
      ).length;
      const rejected = dbRes.rows.filter(report => report.status === 'rejected').length;
      res.status(200).json({
        status: 200,
        data: dbRes.rows,
        reportStats: {
          resolved,
          pending,
          rejected,
        },
      });
    });
  }

  /**
   * @method getAnIncident
   * @description Retrieves a specific record with a given ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getAnIncident(req, res) {
    const { id, isadmin } = req.user;
    const { postId } = req;
    const { incidentType } = req.params;
    const type = incidentType.substr(0, incidentType.length - 1);

    let query = 'SELECT * FROM incidents WHERE type = $1 AND id = $2';
    let params = [type, postId];
    if (isadmin !== 'true') {
      query += ' AND createdby = $3';
      params = [type, postId, id];
    }
    pool.query(query, params, (err, dbRes) => {
      res.status(200).json({ status: 200, data: dbRes.rows[0] });
    });
  }

  /**
   * @method createIncident
   * @description Posts the given record to the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static createIncident(req, res) {
    const { id } = req.user;
    const { incidentType } = req.params;
    const type = incidentType.substr(0, incidentType.length - 1);
    const {
      comment, latitude, longitude, images,
    } = req.body;

    const query = `
    INSERT INTO incidents(createdby, type, comment, latitude, longitude, images) VALUES($1, $2, $3, $4, $5, $6) RETURNING id`;

    pool.query(query, [id, type, comment, latitude, longitude, images], (err, dbRes) => {
      const postId = dbRes.rows[0].id;
      return res.status(201).json({
        status: 201,
        data: [
          {
            id: postId,
            message: `Created ${type} record`,
            incident: {
              type,
              comment,
              latitude,
              longitude,
              images,
            },
          },
        ],
      });
    });
  }

  /**
   * @method updateIncident
   * @description Updates a specific report based on the given parameters
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static updateIncident(req, res) {
    let message;

    const { postId } = req;
    const {
      latitude, longitude, comment, status,
    } = req.body;

    if (status) {
      const query = 'UPDATE incidents SET status = $1 WHERE id = $2 RETURNING id';

      return pool.query(query, [status, postId], (err, dbRes) => {
        res.status(200).json({
          status: 200,
          data: [
            {
              id: postId,
              message: 'Record has been successfully changed',
              incidentStatus: status,
            },
          ],
        });
      });
    }

    if (comment) {
      const { id } = req.user;
      const query = `
      UPDATE incidents SET comment = $1 WHERE id = $2 AND createdby = $3 RETURNING id`;
      return pool.query(query, [comment, postId, id], (err, dbRes) => {
        message = 'Red-flag record comment has been updated succesfully';
        return res.status(200).json({
          status: 200,
          data: [{ id: postId, message, comment }],
        });
      });
    }

    if (latitude && longitude) {
      const { id } = req.user;
      const query = `
      UPDATE incidents SET latitude = $1, longitude = $2 WHERE id = $3 AND createdby = $4 RETURNING id`;
      return pool.query(query, [latitude, longitude, postId, id], (err, dbRes) => {
        message = "Updated red-flag record's location";
        return res.status(200).json({
          status: 200,
          data: [{ id: postId, message, location: `${latitude}, ${longitude}` }],
        });
      });
    }
  }

  /**
   * @method deleteIncident
   * @description Deletes a specific record
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static deleteIncident(req, res) {
    const { postId } = req;
    const query = 'DELETE FROM incidents WHERE id = $1';

    return pool.query(query, [postId], (err, dbRes) => res.status(200).json({
      status: 200,
      data: [{ id: postId, message: 'red-flag record has been deleted' }],
    }));
  }
}

export default IncidentController;
