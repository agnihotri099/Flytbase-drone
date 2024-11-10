import express from 'express';
import { auth } from '../middleware/auth';
import {
  getFlightLog,
  getAllFlightLogs,
  getFlightLogsByDrone,
  getFlightLogsByMission,
  deleteFlightLog
} from '../controllers/flightLogController';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get all flight logs with pagination
router.get('/', getAllFlightLogs);

// Get specific flight log
router.get('/:flightId', getFlightLog);

// Get flight logs by drone
router.get('/drone/:droneId', getFlightLogsByDrone);

// Get flight logs by mission
router.get('/mission/:missionName', getFlightLogsByMission);

// Delete flight log
router.delete('/:flightId', deleteFlightLog);

export default router;