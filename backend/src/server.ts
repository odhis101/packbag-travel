import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from './config/database';
import authRoutes from './routes/auth';
import packageRoutes from './routes/packages';
import bookingRoutes from './routes/bookings';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://frontend-flax-eight-87.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'PackBag API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);

// Global error handler — always return JSON so the frontend can parse it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: err.message || 'Server error' });
});

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
