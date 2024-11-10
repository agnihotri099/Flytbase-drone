import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Drone from '../models/Drone';
import { AuthRequest } from '../middleware/auth';

export const createDrone = async (req: AuthRequest, res: Response) => {
  try {
    const { name, drone_type, make_name } = req.body;
    
    const drone = new Drone({
      drone_id: uuidv4(),
      name,
      drone_type,
      make_name,
      created_by: req.user.userId
    });

    await drone.save();
    res.status(201).json(drone);
  } catch (error) {
    res.status(500).json({ error: 'Error creating drone' });
  }
};

export const getAllDrones = async (req: AuthRequest, res: Response) => {
  try {
    const drones = await Drone.find({ 
      created_by: req.user.userId,
      deleted_by: null 
    });
    res.json(drones);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching drones' });
  }
};

// ... existing imports ...

export const getDroneById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const drone = await Drone.findOne({ 
      drone_id: req.params.id,
      created_by: req.user.userId,
      deleted_by: null
    });

    if (!drone) {
      res.status(404).json({ error: 'Drone not found' });
      return;
    }

    res.json(drone);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching drone' });
  }
};

export const updateDrone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, drone_type, make_name } = req.body;

    const drone = await Drone.findOneAndUpdate(
      { 
        drone_id: req.params.id,
        created_by: req.user.userId,
        deleted_by: null
      },
      { name, drone_type, make_name },
      { new: true }
    );

    if (!drone) {
      res.status(404).json({ error: 'Drone not found' });
      return;
    }

    res.json(drone);
  } catch (error) {
    res.status(500).json({ error: 'Error updating drone' });
  }
};

export const deleteDrone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const drone = await Drone.findOneAndUpdate(
      { 
        drone_id: req.params.id,
        created_by: req.user.userId,
        deleted_by: null
      },
      { 
        deleted_by: req.user.userId,
        deleted_on: new Date()
      },
      { new: true }
    );

    if (!drone) {
      res.status(404).json({ error: 'Drone not found' });
      return;
    }

    res.json({ message: 'Drone deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting drone' });
  }
};