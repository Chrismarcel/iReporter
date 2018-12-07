import express from 'express';
import ValidatePost from '../middleware/ValidatePost';
import PostController from '../controllers/PostController';

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
  PostController.postRecord,
);

// Handle all GET requests
router.get('/red-flags', PostController.getRecords);
router.get(
  '/red-flags/:id', ValidatePost.validatePostId, PostController.getARecord,
);

// Handle all PATCH requests
router.patch(
  '/red-flags/:id/location', ValidatePost.validatePostId, ValidatePost.validateCoordinates, PostController.updateReport,
);
router.patch(
  '/red-flags/:id/comment', ValidatePost.validatePostId, ValidatePost.validateComment, PostController.updateReport,
);

// Handle Delete requests
router.delete('/red-flags/:id', ValidatePost.validatePostId, PostController.deleteRecord);

export default router;
