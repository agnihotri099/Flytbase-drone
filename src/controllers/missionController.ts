import { Request, Response } from 'express';
import Mission from '../models/Mission';
import { AuthRequest } from '../middleware/auth';
import { MissionSimulationService } from '../services/missionSimulation';

export const createMission = async (req: AuthRequest, res: Response) => {
  try {
    const { name, alt, speed, type, waypoints } = req.body;

    const mission = new Mission({
      name,
      alt,
      speed,
      type,
      waypoints,
      created_by: req.user.userId
    });

    await mission.save();
    res.status(201).json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Error creating mission' });
  }
};

export const getAllMissions = async (req: AuthRequest, res: Response) => {
  try {
    const missions = await Mission.find({ created_by: req.user.userId });
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching missions' });
  }
};

export const getMissionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mission = await Mission.findOne({ 
      mission_id: req.params.id,
      created_by: req.user.userId,
      deleted_by: null
    });

    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }

    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching mission' });
  }
};

export const updateMission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mission = await Mission.findOneAndUpdate(
      { 
        mission_id: req.params.id,
        created_by: req.user.userId,
        deleted_by: null
      },
      req.body,
      { new: true }
    );

    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }

    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Error updating mission' });
  }
};

export const deleteMission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mission = await Mission.findOneAndUpdate(
      { 
        mission_id: req.params.id,
        created_by: req.user.userId,
        deleted_by: null
      },
      { 
        deleted_by: req.user.userId,
        deleted_on: new Date()
      },
      { new: true }
    );

    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }

    res.json({ message: 'Mission deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting mission' });
  }
};

export const startMission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mission = await Mission.findOne({ 
      mission_id: req.params.id,
      created_by: req.user.userId,
      deleted_by: null
    });

    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }

    // Add your mission start logic here
    res.json({ message: 'Mission started successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error starting mission' });
  }
};
export const stopMission = async (req: AuthRequest, res: Response) => {
  try {
    const { flightId } = req.params;
    const missionSimulation = new MissionSimulationService();
    await missionSimulation.stopSimulation(flightId);
    res.json({ message: 'Mission stopped successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error stopping mission' });
  }
};