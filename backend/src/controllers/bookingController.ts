import { Response } from 'express';
import { Booking } from '../models/Booking';
import { Package } from '../models/Package';
import { AuthRequest } from '../middleware/auth';

export const createBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { packageId, numberOfGuests } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const pkg = await Package.findById(packageId);
    if (!pkg) {
      res.status(404).json({ message: 'Package not found' });
      return;
    }

    const totalPrice = pkg.price * numberOfGuests;

    const booking = await Booking.create({
      package: packageId,
      user: req.user.id,
      numberOfGuests,
      totalPrice,
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('package')
      .populate('user', 'email');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserBookings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const bookings = await Booking.find({ user: req.user.id })
      .populate('package')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllBookings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const bookings = await Booking.find()
      .populate('package')
      .populate('user', 'email')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateBookingStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('package')
      .populate('user', 'email');

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    res.json({
      message: 'Booking status updated successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const cancelBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
