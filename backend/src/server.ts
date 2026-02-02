import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import authRoutes from './routes/auth';
import packageRoutes from './routes/packages';
import bookingRoutes from './routes/bookings';

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

app.get('/', (req, res) => {
  res.json({ message: 'PackBag API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
