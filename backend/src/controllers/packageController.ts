import { Response } from 'express';
import { Package } from '../models/Package';
import { AuthRequest } from '../middleware/auth';

export const getCities = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const packages = await Package.find({ isActive: true }).select('city images image');

    const cityMap: Record<string, { image: string; count: number }> = {};

    for (const pkg of packages) {
      if (!cityMap[pkg.city]) {
        const coverImage =
          (pkg.images && pkg.images.length > 0 ? pkg.images[0] : null) ||
          pkg.image ||
          '';
        cityMap[pkg.city] = { image: coverImage, count: 0 };
      }
      const entry = cityMap[pkg.city];
      if (entry) {
        entry.count += 1;
        if (!entry.image) {
          const img =
            (pkg.images && pkg.images.length > 0 ? pkg.images[0] : null) ||
            pkg.image ||
            '';
          if (img) entry.image = img;
        }
      }
    }

    const cities = Object.entries(cityMap).map(([name, data]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      image: data.image,
      packageCount: data.count,
    }));

    res.json({ cities });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllPackages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { city, tier } = req.query;
    const filter: Record<string, unknown> = { isActive: true };
    if (city) filter.city = city;
    if (tier) filter.tier = tier;

    const packages = await Package.find(filter)
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
      city,
      tier,
      destination,
      description,
      price,
      duration,
      images,
      image,
      included,
      restaurants,
      attractions,
      itinerary,
    } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const pkg = await Package.create({
      title,
      city,
      tier,
      destination,
      description,
      price,
      duration,
      images: images || [],
      image: image || '',
      included: included || [],
      restaurants: restaurants || [],
      attractions: attractions || [],
      itinerary: itinerary || [],
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
