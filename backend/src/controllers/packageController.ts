import { Response } from 'express';
import { Package } from '../models/Package';
import { AuthRequest } from '../middleware/auth';

export const getAllPackages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const packages = await Package.find({ isActive: true })
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });

    res.json({ packages });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPackageById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const pkg = await Package.findById(id).populate('createdBy', 'email');

    if (!pkg) {
      res.status(404).json({ message: 'Package not found' });
      return;
    }

    res.json({ package: pkg });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createPackage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      destination,
      description,
      price,
      duration,
      image,
      included,
      itinerary,
    } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const pkg = await Package.create({
      title,
      destination,
      description,
      price,
      duration,
      image,
      included,
      itinerary,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: 'Package created successfully',
      package: pkg,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updatePackage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const pkg = await Package.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pkg) {
      res.status(404).json({ message: 'Package not found' });
      return;
    }

    res.json({
      message: 'Package updated successfully',
      package: pkg,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deletePackage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const pkg = await Package.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!pkg) {
      res.status(404).json({ message: 'Package not found' });
      return;
    }

    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
