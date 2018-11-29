import express from 'express';
import ValidatePost from '../middleware/ValidatePost';
import PostController from '../controllers/PostController';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to iReporter API v1' });
});

router.post('/red-flags', ValidatePost.validatePostRecord, PostController.postRecord);

router.get('/red-flags', PostController.getRecords);
router.get('/red-flags/:id', PostController.getARecord);

export default router;
