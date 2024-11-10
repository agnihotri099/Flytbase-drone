import mongoose from 'mongoose';

const flightLogSchema = new mongoose.Schema({
  flight_id: {
    type: String,
    required: true,
    unique: true,
  },
  drone_id: {
    type: String,
    required: true,
    ref: 'Drone',
  },
  mission_name: {
    type: String,
    required: true,
  },
  waypoints: [{
    time: Number,
    alt: Number,
    lat: Number,
    lng: Number,
  }],
  speed: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  execution_start: {
    type: Date,
    required: true,
  },
  execution_end: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('FlightLog', flightLogSchema);