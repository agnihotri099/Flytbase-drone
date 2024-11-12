import { Request, Response } from 'express';
import Mission from '../models/Mission';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { MissionSimulationService } from '../services/missionSimulation';
import Drone from '../models/Drone';

export const createMission = async (req: AuthRequest, res: Response) => {
  try {
    const { name, alt, speed, type, waypoints,description,drone_id } = req.body;

    const mission = new Mission({
      mission_id: uuidv4(),
      drone_id,
      description,
      name,
      alt,
      speed,
      type,
      waypoints,
      created_by: req.user.userId
    });

    await mission.save();
    // console.log(mission);
    res.status(201).json(mission);
    // res.json(mission);
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
    console.log(req.params.id);
    console.log(req.user.userId);
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

    const  droneId  = mission.drone_id
    // console.log("Mission_id" , mission.mission_id)
    const drone = await Drone.findOne({ drone_id: droneId });
    if (!drone) {
      res.status(404).json({ error: 'Drone not found' });
      return;
    }

    // Start the mission simulation
    const missionSimulationService = new MissionSimulationService();
    const flightId = await missionSimulationService.startSimulation(mission.mission_id, droneId);
    // console.log("Flight_ID",flightId);

    // Add your mission start logic here
    // res.json({ message: 'Mission started successfully' });
    res.status(200).json({
      message: 'Mission simulation started successfully',
      flightId,
    });
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
}

export const getAllMission = async (req: AuthRequest, res: Response) => {
  try {
    const missions = await Mission.find({ 
      created_by: req.user.userId,
      deleted_by: null 
    });
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching missions' });
  }
};
