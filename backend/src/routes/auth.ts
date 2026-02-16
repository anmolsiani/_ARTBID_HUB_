
import express from 'express';
import { signup, login, getMe, checkUsername, generateUsername } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/check-username/:username', checkUsername);
router.post('/generate-username', generateUsername); // Assuming this is also POST if it's generating

export default router;
