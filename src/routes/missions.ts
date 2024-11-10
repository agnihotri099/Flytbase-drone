import express from 'express';
import { auth } from '../middleware/auth';
import {
  getMissionById,
  updateMission,
  deleteMission,
  startMission
} from '../controllers/missionController';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Mission routes
router.get('/:id', auth, getMissionById);
router.put('/:id', auth, updateMission);
router.delete('/:id', auth, deleteMission);
router.post('/:id/start', auth, startMission);

export default router;