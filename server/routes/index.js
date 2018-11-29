import express from 'express';
import ValidatePost from '../middleware/ValidatePost';
import PostController from '../controllers/PostController';

const router = express.Router();

// Handle requests on the /api/v1 endpoint
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to iReporter API v1' });
});

// Handle POST requests
router.post('/red-flags', ValidatePost.validatePostRequest, PostController.postRecord);

// Handle all GET requests
router.get('/red-flags', PostController.getRecords);
router.get('/red-flags/:id', ValidatePost.validateGetRequest, PostController.getARecord);

// Handle all PATCH requests
router.patch('/red-flags/:id/location', ValidatePost.validatePatchLocation, PostController.updateLocation);

export default router;
