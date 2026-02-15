import { Router } from 'express';
import {
    getUserProfile,
    updateProfile,
    followUser,
    getFollowers,
    getFollowing,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/profile/:username', getUserProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/:userId/follow', authenticate, followUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

export default router;
