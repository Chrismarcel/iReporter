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
  '/:incidentType',
  ValidateIncident.validateIncidentType,
  ValidateIncident.validateCoordinates,
  ValidateIncident.validateComment,
  AuthenticateUser.verifyUser,
  IncidentController.createIncident,
);
router.post(
  '/auth/register',
  ValidateUser.validateLoginDetails,
  ValidateUser.validateProfileDetails,
  ValidateUser.validateExistingUser,
  UserController.registerUser,
);
router.post(
  '/auth/login',
  ValidateUser.validateLoginDetails,
  UserController.loginUser,
);

// Handle all GET requests
router.get(
  '/:incidentType',
  ValidateIncident.validateIncidentType,
  AuthenticateUser.verifyUser,
  IncidentController.getAllIncidents,
);
router.get(
  '/:incidentType/:id',
  ValidateIncident.validateIncidentType,
  AuthenticateUser.verifyUser,
  ValidateIncident.validateIncidentId,
  IncidentController.getAnIncident,
);

// Handle all PATCH requests
router.patch(
  '/:incidentType/:id/location',
  ValidateIncident.validateIncidentType,
  AuthenticateUser.verifyUser,
  ValidateIncident.validateIncidentId,
  ValidateIncident.validateCoordinates,
  ValidateIncident.validateStatus,
  IncidentController.updateIncident,
);
router.patch(
  '/:incidentType/:id/comment',
  ValidateIncident.validateIncidentType,
  AuthenticateUser.verifyUser,
  ValidateIncident.validateIncidentId,
  ValidateIncident.validateComment,
  ValidateIncident.validateStatus,
  IncidentController.updateIncident,
);
router.patch(
  '/:incidentType/:id/status',
  ValidateIncident.validateIncidentType,
  AuthenticateUser.verifyAdmin,
  ValidateIncident.validateIncidentId,
  ValidateIncident.validateStatus,
  IncidentController.updateIncident,
);

// Handle Delete requests
router.delete(
  '/:incidentType/:id',
  ValidateIncident.validateIncidentType,
  AuthenticateUser.verifyUser,
  ValidateIncident.validateIncidentId,
  ValidateIncident.validateStatus,
  IncidentController.deleteIncident,
);

export default router;
