import express from 'express';
import {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/packageController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllPackages);
router.get('/:id', getPackageById);
router.post('/', authenticate, authorize('admin'), createPackage);
router.put('/:id', authenticate, authorize('admin'), updatePackage);
router.delete('/:id', authenticate, authorize('admin'), deletePackage);

export default router;
