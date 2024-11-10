export interface IWaypoint {
    alt: number;
    lat: number;
    lng: number;
    time?: number;
  }
  
  export interface IMissionData {
    _id: string;
    name: string;
    alt: number;
    speed: number;
    type: 'path' | 'grid' | 'corridor';
    waypoints: IWaypoint[];
    created_by: string;
  }
  
  export interface IFlightLogData {
    flight_id: string;
    drone_id: string;
    mission_name: string;
    waypoints: Array<IWaypoint & { time: number }>;
    speed: number;
    distance: number;
    execution_start: Date;
    execution_end: Date;
  }
  
  export interface ISimulationState {
    isRunning: boolean;
    currentWaypoint: number;
    flightId: string;
  }
  
  export interface IUser {
    _id: string;
    email: string;
    name: string;
  }
  
  export interface IDrone {
    drone_id: string;
    name: string;
    drone_type: 'Real Drone' | 'Virtual Drone';
    make_name: string;
    created_by: string;
    deleted_by?: string | null;
    deleted_on?: Date | null;
  }