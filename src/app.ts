import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import droneRoutes from './routes/drones';
import missionRoutes from './routes/missions';
import flightLogRoutes from './routes/flightLogs';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drones', droneRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/flight-logs', flightLogRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});