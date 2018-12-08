import express from 'express';
import ValidateRecord from '../middleware/ValidateRecord';
import IncidentController from '../controllers/IncidentController';

const router = express.Router();

// Handle requests on the /api/v1 endpoint
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to iReporter API v1' });
});

// Handle POST requests
router.post(
  '/red-flags',
  ValidateRecord.validateRecordType,
  ValidateRecord.validateCoordinates,
  ValidateRecord.validateComment,
  IncidentController.postRecord,
);

// Handle all GET requests
router.get('/red-flags', IncidentController.getRecords);
router.get(
  '/red-flags/:id', ValidateRecord.validateRecordId, IncidentController.getARecord,
);

// Handle all PATCH requests
router.patch(
  '/red-flags/:id/location', ValidateRecord.validateRecordId, ValidateRecord.validateCoordinates, IncidentController.updateReport,
);
router.patch(
  '/red-flags/:id/comment', ValidateRecord.validateRecordId, ValidateRecord.validateComment, IncidentController.updateReport,
);

// Handle Delete requests
router.delete('/red-flags/:id', ValidateRecord.validateRecordId, IncidentController.deleteRecord);

export default router;
