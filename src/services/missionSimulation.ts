import { v4 as uuidv4 } from 'uuid';
import FlightLog from '../models/FlightLog';
import Mission from '../models/Mission';
import Drone from '../models/Drone';
import { IWaypoint } from '../types';

interface SimulationState {
  isRunning: boolean;
  currentWaypoint: number;
  flightId: string;
}

// Store active simulations
const activeSimulations: Map<string, SimulationState> = new Map();

export class MissionSimulationService {
  private static readonly EARTH_RADIUS = 6371e3; // Earth's radius in meters

  /**
   * Start a new mission simulation
   */
  async startSimulation(missionId: string, droneId: string): Promise<string> {
    // Validate mission and drone
    // console.log("started simulation")
    const mission = await Mission.findOne({mission_id:missionId});
    const drone = await Drone.findOne({ drone_id: droneId });

    if (!mission || !drone) {
      throw new Error('Mission or drone not found');
    }
    // console.log(mission.waypoints)

    const flightId = uuidv4();
    const totalDistance = this.calculateTotalDistance(mission.waypoints);
    // console.log("distance",totalDistance)

    // Create flight log
    const flightLog = new FlightLog({
      flight_id: flightId,
      drone_id: droneId,
      mission_name: mission.name,
      waypoints: [],
      speed: mission.speed,
      distance: totalDistance,
      execution_start: new Date(),
      execution_end: new Date()
    });

    await flightLog.save();
    
    // Initialize simulation state
    const simulationState: SimulationState = {
      isRunning: true,
      currentWaypoint: 0,
      flightId
    };
    
    console.log("HIHIHIHIHI222")
    console.log("state",simulationState)

    activeSimulations.set(flightId, simulationState);

    // Start simulation process
    this.simulateMissionExecution(mission, flightLog, simulationState);

    return flightId;
  }

  /**
   * Stop an active mission simulation
   */
  async stopSimulation(flightId: string): Promise<void> {
    const simulation = activeSimulations.get(flightId);
    if (simulation) {
      simulation.isRunning = false;
      activeSimulations.delete(flightId);
      await this.completeMission(flightId);
    }
  }

  /**
   * Calculate distance between two waypoints using Haversine formula
   */
  private calculateDistance(wp1: IWaypoint, wp2: IWaypoint): number {
    const φ1 = (wp1.lat * Math.PI) / 180;
    const φ2 = (wp2.lat * Math.PI) / 180;
    const Δφ = ((wp2.lat - wp1.lat) * Math.PI) / 180;
    const Δλ = ((wp2.lng - wp1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return  MissionSimulationService.EARTH_RADIUS * c;
  }

  /**
   * Calculate total mission distance
   */
  private calculateTotalDistance(waypoints: IWaypoint[]): number {
    let totalDistance = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      totalDistance += this.calculateDistance(waypoints[i], waypoints[i + 1]);
    }
    return totalDistance;
  }

  /**
   * Calculate time between waypoints based on speed and distance
   */
  private calculateTimeInterval(wp1: IWaypoint, wp2: IWaypoint, speed: number): number {
    const distance = this.calculateDistance(wp1, wp2);
    return (distance / speed); // Time in seconds
  }

  /**
   * Simulate mission execution
   */
  private async simulateMissionExecution(
    mission: any,
    flightLog: any,
    simulationState: SimulationState
  ): Promise<void> {
    let currentTime = 0;
    const { waypoints, speed } = mission;

    const updateInterval = setInterval(async () => {
      if (!simulationState.isRunning || simulationState.currentWaypoint >= waypoints.length) {
        clearInterval(updateInterval);
        await this.completeMission(flightLog.flight_id);
        return;
      }

      const currentWaypoint = waypoints[simulationState.currentWaypoint];
      
      // Log waypoint with timestamp
      await FlightLog.findByIdAndUpdate(
        flightLog._id,
        {
          $push: {
            waypoints: {
              time: currentTime,
              alt: currentWaypoint.alt,
              lat: currentWaypoint.lat,
              lng: currentWaypoint.lng
            }
          }
        }
      );

      if (simulationState.currentWaypoint < waypoints.length - 1) {
        const nextWaypoint = waypoints[simulationState.currentWaypoint + 1];
        const timeInterval = this.calculateTimeInterval(currentWaypoint, nextWaypoint, speed);
        currentTime += timeInterval;
      }

      simulationState.currentWaypoint++;
    }, 1000); // Update every second for simulation purposes
  }

  /**
   * Complete mission and update flight log
   */
  private async completeMission(flightId: string): Promise<void> {
    await FlightLog.findOneAndUpdate(
      { flight_id: flightId },
      { 
        execution_end: new Date(),
        $set: { completed: true }
      }
    );
  }

  /**
   * Get simulation status
   */
  getSimulationStatus(flightId: string): boolean {
    const simulation = activeSimulations.get(flightId);
    return simulation ? simulation.isRunning : false;
  }

  /**
   * Get current waypoint for active simulation
   */
  getCurrentWaypoint(flightId: string): number | null {
    const simulation = activeSimulations.get(flightId);
    return simulation ? simulation.currentWaypoint : null;
  }
}

// export default new MissionSimulationService();