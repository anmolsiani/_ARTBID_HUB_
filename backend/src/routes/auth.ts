import { Router } from 'express';
import {
    signup,
    login,
    getMe,
    checkUsername,
    generateUsername,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/check-username/:username', checkUsername);
router.post('/generate-username', generateUsername);

export default router;
