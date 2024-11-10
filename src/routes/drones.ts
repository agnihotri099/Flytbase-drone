import express from 'express';
import { auth } from '../middleware/auth';
import {
  createDrone,
  getAllDrones,
  getDroneById,
  updateDrone,
  deleteDrone
} from '../controllers/droneController';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

router.post('/', createDrone);
router.get('/', getAllDrones);
router.get('/:id', auth, getDroneById);
router.put('/:id', auth, updateDrone);
router.delete('/:id', auth, deleteDrone);

export default router;