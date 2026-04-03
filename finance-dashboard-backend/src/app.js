import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { createTables, seedDatabase } from './db/seed.js';

import authRoutes from './routes/auth.js';
import recordsRoutes from './routes/records.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();

// Initialize DB & Seed basic roles/admin
seedDatabase(bcrypt);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Finance Backend API is running 🚀");
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Generic Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

export default app;
