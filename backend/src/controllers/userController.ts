import { Response } from 'express';
import { User } from '../models/User';
import { Artwork } from '../models/Artwork';
import { AuthRequest } from '../types';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username: username.toLowerCase() })
            .select('-password')
            .lean();

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const artworkCount = await Artwork.countDocuments({ userId: user._id });

        res.json({
            user: {
                ...user,
                followersCount: user.followers.length,
                followingCount: user.following.length,
                artworkCount,
            },
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ message: 'Failed to get user profile' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const { displayName, bio, socialLinks, avatar } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                ...(displayName && { displayName }),
                ...(bio !== undefined && { bio }),
                ...(socialLinks && { socialLinks }),
                ...(avatar && { avatar }),
            },
            { new: true, runValidators: true }
        );

        res.json({ message: 'Profile updated', user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

export const followUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const { userId } = req.params;

        if (userId === req.user.id) {
            res.status(400).json({ message: 'Cannot follow yourself' });
            return;
        }

        const [currentUser, targetUser] = await Promise.all([
            User.findById(req.user.id),
            User.findById(userId),
        ]);

        if (!targetUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!currentUser) {
            res.status(404).json({ message: 'Current user not found' });
            return;
        }

        const isFollowing = currentUser.following.includes(targetUser._id);

        if (isFollowing) {
            currentUser.following = currentUser.following.filter(
                (id) => id.toString() !== userId
            );
            targetUser.followers = targetUser.followers.filter(
                (id) => id.toString() !== req.user!.id
            );
        } else {
            currentUser.following.push(targetUser._id);
            targetUser.followers.push(currentUser._id);
        }

        await Promise.all([currentUser.save(), targetUser.save()]);

        res.json({
            message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
            isFollowing: !isFollowing,
        });
    } catch (error) {
        console.error('Follow user error:', error);
        res.status(500).json({ message: 'Failed to follow/unfollow user' });
    }
};

export const getFollowers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('followers', 'username displayName avatar');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({ followers: user.followers });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get followers' });
    }
};

export const getFollowing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('following', 'username displayName avatar');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({ following: user.following });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get following' });
    }
};
