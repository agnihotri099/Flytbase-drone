import { Response } from 'express';
import FlightLog from '../models/FlightLog';
import { AuthRequest } from '../middleware/auth';

export const getFlightLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const flightLog = await FlightLog.findOne({ flight_id: req.params.flightId });

    if (!flightLog) {
      res.status(404).json({ error: 'Flight log not found' });
      return;
    }

    res.json(flightLog);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching flight log' });
  }
};

export const getAllFlightLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const flightLogs = await FlightLog.find()
      .sort({ execution_start: -1 })
      .limit(parseInt(req.query.limit as string) || 10)
      .skip(parseInt(req.query.skip as string) || 0);

    res.json(flightLogs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching flight logs' });
  }
};

export const getFlightLogsByDrone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const flightLogs = await FlightLog.find({ drone_id: req.params.droneId })
      .sort({ execution_start: -1 });

    res.json(flightLogs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching flight logs' });
  }
};

export const getFlightLogsByMission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const flightLogs = await FlightLog.find({ mission_name: req.params.missionName })
      .sort({ execution_start: -1 });

    res.json(flightLogs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching flight logs' });
  }
};

export const deleteFlightLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const flightLog = await FlightLog.findOneAndDelete({ 
      flight_id: req.params.flightId 
    });

    if (!flightLog) {
      res.status(404).json({ error: 'Flight log not found' });
      return;
    }

    res.json({ message: 'Flight log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting flight log' });
  }
};