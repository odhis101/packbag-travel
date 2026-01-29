import express from 'express';
import { signup, login, getProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

export default router;
