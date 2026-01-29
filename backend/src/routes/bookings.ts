import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/bookingController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, createBooking);
router.get('/my-bookings', authenticate, getUserBookings);
router.get('/', authenticate, authorize('admin'), getAllBookings);
router.put('/:id/status', authenticate, authorize('admin'), updateBookingStatus);
router.put('/:id/cancel', authenticate, cancelBooking);

export default router;
