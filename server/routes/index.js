import express from 'express';
import ValidateIncident from '../middleware/ValidateIncident';
import ValidateUser from '../middleware/ValidateUser';
import AuthenticateUser from '../middleware/AuthenticateUser';
import IncidentController from '../controllers/IncidentController';
import UserController from '../controllers/UserController';

const router = express.Router();

// Handle requests on the /api/v1 endpoint
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to iReporter API v1' });
});

// Handle POST requests
router.post(
  '/:type',
  ValidateIncident.validateIncidentType,
  ValidateIncident.validateCoordinates,
  ValidateIncident.validateComment,
  AuthenticateUser.verifyToken,
  IncidentController.postRecord,
);
router.post(
  '/auth/register',
  ValidateUser.validateLoginDetails,
  ValidateUser.validateProfileDetails,
  AuthenticateUser.generateToken,
  UserController.registerUser,
);
router.post(
  '/auth/login',
  ValidateUser.validateLoginDetails,
  AuthenticateUser.generateToken,
  UserController.loginUser,
);

// Handle all GET requests
router.get('/:type', AuthenticateUser.verifyToken, IncidentController.getRecords);
router.get(
  '/:type/:id',
  AuthenticateUser.verifyToken,
  ValidateIncident.validateIncidentId,
  IncidentController.getARecord,
);

// Handle all PATCH requests
router.patch(
  '/:type/:id/location',
  AuthenticateUser.verifyToken,
  ValidateIncident.validateIncidentId,
  ValidateIncident.validateCoordinates,
  IncidentController.updateReport,
);
router.patch(
  '/:type/:id/comment',
  AuthenticateUser.verifyToken,
  ValidateIncident.validateIncidentId,
  ValidateIncident.validateComment,
  IncidentController.updateReport,
);

// Handle Delete requests
router.delete(
  '/:type/:id',
  AuthenticateUser.verifyToken,
  ValidateIncident.validateIncidentId,
  IncidentController.deleteRecord,
);

export default router;
