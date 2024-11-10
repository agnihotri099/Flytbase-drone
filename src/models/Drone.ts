import mongoose from 'mongoose';

const droneSchema = new mongoose.Schema({
  drone_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  drone_type: {
    type: String,
    required: true,
  },
  make_name: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deleted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  deleted_on: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

export default mongoose.model('Drone', droneSchema);