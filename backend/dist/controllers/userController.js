"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = exports.getFollowing = exports.getFollowers = exports.followUser = exports.updateProfile = exports.getUserProfile = void 0;
const User_1 = require("../models/User");
const Artwork_1 = require("../models/Artwork");
const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User_1.User.findOne({ username: username.toLowerCase() })
            .select('-password')
            .lean();
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const artworkCount = await Artwork_1.Artwork.countDocuments({ userId: user._id });
        res.json({
            user: {
                ...user,
                followersCount: user.followers.length,
                followingCount: user.following.length,
                artworkCount,
            },
        });
    }
    catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ message: 'Failed to get user profile' });
    }
};
exports.getUserProfile = getUserProfile;
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { displayName, bio, socialLinks, avatar } = req.body;
        const user = await User_1.User.findByIdAndUpdate(req.user.id, {
            ...(displayName && { displayName }),
            ...(bio !== undefined && { bio }),
            ...(socialLinks && { socialLinks }),
            ...(avatar && { avatar }),
        }, { new: true, runValidators: true });
        res.json({ message: 'Profile updated', user });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};
exports.updateProfile = updateProfile;
const followUser = async (req, res) => {
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
            User_1.User.findById(req.user.id),
            User_1.User.findById(userId),
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
            currentUser.following = currentUser.following.filter((id) => id.toString() !== userId);
            targetUser.followers = targetUser.followers.filter((id) => id.toString() !== req.user.id);
        }
        else {
            currentUser.following.push(targetUser._id);
            targetUser.followers.push(currentUser._id);
        }
        await Promise.all([currentUser.save(), targetUser.save()]);
        res.json({
            message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
            isFollowing: !isFollowing,
        });
    }
    catch (error) {
        console.error('Follow user error:', error);
        res.status(500).json({ message: 'Failed to follow/unfollow user' });
    }
};
exports.followUser = followUser;
const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User_1.User.findById(userId).populate('followers', 'username displayName avatar');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ followers: user.followers });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get followers' });
    }
};
exports.getFollowers = getFollowers;
const getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User_1.User.findById(userId).populate('following', 'username displayName avatar');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ following: user.following });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get following' });
    }
};
exports.getFollowing = getFollowing;
const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string' || q.trim().length < 1) {
            return res.json({ users: [] });
        }
        const query = q.trim();
        const users = await User_1.User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { displayName: { $regex: query, $options: 'i' } }
            ]
        })
            .select('username displayName avatar bio role followers following')
            .limit(20)
            .lean();
        const result = users.map(u => ({
            ...u,
            followersCount: u.followers ? u.followers.length : 0,
            followingCount: u.following ? u.following.length : 0,
        }));
        return res.json({ users: result });
    } catch (error) {
        console.error('Search users error:', error);
        return res.status(500).json({ message: 'Failed to search users' });
    }
};
exports.searchUsers = searchUsers;
//# sourceMappingURL=userController.js.map