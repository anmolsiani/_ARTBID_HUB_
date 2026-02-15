import { Response } from 'express';
import { Artwork } from '../models/Artwork';
import { Comment } from '../models/Comment';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import { AuthRequest } from '../types';

export const createArtwork = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const { title, description, category, price, forSale, type } = req.body;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            res.status(400).json({ message: 'At least one image is required' });
            return;
        }

        if (files.length > 10) {
            res.status(400).json({ message: 'Maximum 10 images allowed' });
            return;
        }

        const imageUploads = await Promise.all(
            files.map(async (file) => {
                const b64 = Buffer.from(file.buffer).toString('base64');
                const dataURI = `data:${file.mimetype};base64,${b64}`;
                return uploadToCloudinary(dataURI, 'artbid-hub/artworks');
            })
        );

        const artwork = await Artwork.create({
            userId: req.user.id,
            title,
            description,
            images: imageUploads,
            category: Array.isArray(category) ? category : [category],
            price: forSale ? price : undefined,
            forSale: forSale || false,
            type: type || 'human',
        });

        await artwork.populate('userId', 'username displayName avatar');

        res.status(201).json({ message: 'Artwork created', artwork });
    } catch (error) {
        console.error('Create artwork error:', error);
        res.status(500).json({ message: 'Failed to create artwork' });
    }
};

export const getArtworks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { type, category, userId, page = 1, limit = 20, sort = '-createdAt' } = req.query;

        const filter: any = {};
        if (type) filter.type = type;
        if (category) filter.category = category;
        if (userId) filter.userId = userId;

        const artworks = await Artwork.find(filter)
            .populate('userId', 'username displayName avatar isVerified')
            .sort(sort as string)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean();

        const total = await Artwork.countDocuments(filter);

        res.json({
            artworks,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error('Get artworks error:', error);
        res.status(500).json({ message: 'Failed to get artworks' });
    }
};

export const getArtworkById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const artwork = await Artwork.findById(id)
            .populate('userId', 'username displayName avatar isVerified bio')
            .populate({
                path: 'comments',
                populate: { path: 'userId', select: 'username displayName avatar' },
            });

        if (!artwork) {
            res.status(404).json({ message: 'Artwork not found' });
            return;
        }

        // Increment view count
        artwork.views += 1;
        await artwork.save();

        res.json({ artwork });
    } catch (error) {
        console.error('Get artwork error:', error);
        res.status(500).json({ message: 'Failed to get artwork' });
    }
};

export const updateArtwork = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const { id } = req.params;
        const { title, description, category, price, forSale } = req.body;

        const artwork = await Artwork.findById(id);

        if (!artwork) {
            res.status(404).json({ message: 'Artwork not found' });
            return;
        }

        if (artwork.userId.toString() !== req.user.id) {
            res.status(403).json({ message: 'Not authorized to update this artwork' });
            return;
        }

        artwork.title = title || artwork.title;
        artwork.description = description !== undefined ? description : artwork.description;
        artwork.category = category || artwork.category;
        artwork.price = forSale ? price : undefined;
        artwork.forSale = forSale !== undefined ? forSale : artwork.forSale;

        await artwork.save();

        res.json({ message: 'Artwork updated', artwork });
    } catch (error) {
        console.error('Update artwork error:', error);
        res.status(500).json({ message: 'Failed to update artwork' });
    }
};

export const deleteArtwork = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const { id } = req.params;

        const artwork = await Artwork.findById(id);

        if (!artwork) {
            res.status(404).json({ message: 'Artwork not found' });
            return;
        }

        if (artwork.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(403).json({ message: 'Not authorized to delete this artwork' });
            return;
        }

        // Delete images from Cloudinary
        await Promise.all(
            artwork.images.map((img) => deleteFromCloudinary(img.publicId))
        );

        await artwork.deleteOne();

        res.json({ message: 'Artwork deleted' });
    } catch (error) {
        console.error('Delete artwork error:', error);
        res.status(500).json({ message: 'Failed to delete artwork' });
    }
};

export const likeArtwork = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const { id } = req.params;

        const artwork = await Artwork.findById(id);

        if (!artwork) {
            res.status(404).json({ message: 'Artwork not found' });
            return;
        }

        const userId = req.user.id;
        const hasLiked = artwork.likes.some((like) => like.toString() === userId);

        if (hasLiked) {
            artwork.likes = artwork.likes.filter((like) => like.toString() !== userId);
        } else {
            artwork.likes.push(userId as any);
        }

        await artwork.save();

        res.json({
            message: hasLiked ? 'Unliked' : 'Liked',
            liked: !hasLiked,
            likesCount: artwork.likes.length,
        });
    } catch (error) {
        console.error('Like artwork error:', error);
        res.status(500).json({ message: 'Failed to like artwork' });
    }
};

export const saveArtwork = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const { id } = req.params;

        const artwork = await Artwork.findById(id);

        if (!artwork) {
            res.status(404).json({ message: 'Artwork not found' });
            return;
        }

        const userId = req.user.id;
        const hasSaved = artwork.saves.some((save) => save.toString() === userId);

        if (hasSaved) {
            artwork.saves = artwork.saves.filter((save) => save.toString() !== userId);
        } else {
            artwork.saves.push(userId as any);
        }

        await artwork.save();

        res.json({
            message: hasSaved ? 'Unsaved' : 'Saved',
            saved: !hasSaved,
        });
    } catch (error) {
        console.error('Save artwork error:', error);
        res.status(500).json({ message: 'Failed to save artwork' });
    }
};

export const getSavedArtworks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const artworks = await Artwork.find({ saves: req.user.id })
            .populate('userId', 'username displayName avatar')
            .sort('-createdAt');

        res.json({ artworks });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get saved artworks' });
    }
};

export const getReelsFeed = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user?.id;

        let filter: any = {};

        // Algorithm: 60% following, 30% trending, 10% random
        const artworks = await Artwork.find(filter)
            .populate('userId', 'username displayName avatar isVerified')
            .sort('-createdAt')
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean();

        const hasMore = artworks.length === Number(limit);

        res.json({
            posts: artworks,
            hasMore,
            nextCursor: hasMore ? String(Number(page) + 1) : null,
        });
    } catch (error) {
        console.error('Get reels feed error:', error);
        res.status(500).json({ message: 'Failed to get reels feed' });
    }
};
