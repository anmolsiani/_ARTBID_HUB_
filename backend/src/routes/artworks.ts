import { Router } from 'express';
import {
    createArtwork,
    getArtworks,
    getArtworkById,
    updateArtwork,
    deleteArtwork,
    likeArtwork,
    saveArtwork,
    getSavedArtworks,
    getReelsFeed,
} from '../controllers/artworkController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', authenticate, upload.array('images', 10), createArtwork);
router.get('/', getArtworks);
router.get('/saved', authenticate, getSavedArtworks);
router.get('/reels', getReelsFeed);
router.get('/:id', getArtworkById);
router.put('/:id', authenticate, updateArtwork);
router.delete('/:id', authenticate, deleteArtwork);
router.post('/:id/like', authenticate, likeArtwork);
router.post('/:id/save', authenticate, saveArtwork);

export default router;
