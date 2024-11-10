import mongoose from 'mongoose';

const waypointSchema = new mongoose.Schema({
  alt: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
});

const missionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  alt: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    required: true,
  },
  waypoints: [waypointSchema],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Mission', missionSchema);