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
  '/:type',
  AuthenticateUser.verifyUser,
  IncidentController.getAllIncidents,
);
router.get(
  '/:type/:id',
  AuthenticateUser.verifyUser,
  ValidateIncident.validateIncidentId,
  IncidentController.getAnIncident,
);

// Handle all PATCH requests
router.patch(
  '/:type/:id/location',
  AuthenticateUser.verifyUser,
  ValidateIncident.validateIncidentId,
  ValidateIncident.validateCoordinates,
  IncidentController.updateIncident,
);
router.patch(
  '/:type/:id/comment',
  AuthenticateUser.verifyUser,
  ValidateIncident.validateIncidentId,
  ValidateIncident.validateComment,
  IncidentController.updateIncident,
);
router.patch(
  '/:type/:id/status',
  AuthenticateUser.verifyAdmin,
  ValidateIncident.validateIncidentId,
  ValidateIncident.validateIncidentType,
  IncidentController.updateIncident,
);

// Handle Delete requests
router.delete(
  '/:type/:id',
  AuthenticateUser.verifyUser,
  ValidateIncident.validateIncidentId,
  IncidentController.deleteIncident,
);

export default router;
