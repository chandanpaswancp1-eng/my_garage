import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Sewa Automobile API is running...' });
});

import { login } from './controllers/authController.js';
import { getUsers } from './controllers/userController.js';
import { getVehicles } from './controllers/vehicleController.js';
import { getBookings, createBooking } from './controllers/serviceController.js';

// Auth
app.post('/api/auth/login', login);

// Users
app.get('/api/users', getUsers);

// Vehicles
app.get('/api/vehicles', getVehicles);

// Bookings
app.get('/api/bookings', getBookings);
app.post('/api/bookings', createBooking);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
