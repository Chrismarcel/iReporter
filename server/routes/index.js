import express from 'express';
import ValidatePost from '../middleware/ValidatePost';
import IncidentController from '../controllers/IncidentController';

const router = express.Router();

// Handle requests on the /api/v1 endpoint
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to iReporter API v1' });
});

// Handle POST requests
router.post(
  '/red-flags',
  ValidatePost.validatePostType,
  ValidatePost.validateCoordinates,
  ValidatePost.validateComment,
  IncidentController.postRecord,
);

// Handle all GET requests
router.get('/red-flags', IncidentController.getRecords);
router.get(
  '/red-flags/:id', ValidatePost.validatePostId, IncidentController.getARecord,
);

// Handle all PATCH requests
router.patch(
  '/red-flags/:id/location', ValidatePost.validatePostId, ValidatePost.validateCoordinates, IncidentController.updateReport,
);
router.patch(
  '/red-flags/:id/comment', ValidatePost.validatePostId, ValidatePost.validateComment, IncidentController.updateReport,
);

// Handle Delete requests
router.delete('/red-flags/:id', ValidatePost.validatePostId, IncidentController.deleteRecord);

export default router;
