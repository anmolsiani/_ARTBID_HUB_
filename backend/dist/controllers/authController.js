"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsername = exports.checkUsername = exports.getMe = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const signup = async (req, res) => {
    try {
        const { email, username, displayName, password, role } = req.body;
        const existingUser = await User_1.User.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            res.status(400).json({
                message: existingUser.email === email
                    ? 'Email already registered'
                    : 'Username already taken',
            });
            return;
        }
        const user = await User_1.User.create({
            email,
            username: username.toLowerCase(),
            displayName: displayName || username,
            password,
            ...(role && ['user', 'developer'].includes(role) ? { role } : {}),
        });
        const token = jsonwebtoken_1.default.sign({
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') });
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                avatar: user.avatar,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') });
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                avatar: user.avatar,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const user = await User_1.User.findById(req.user.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ user });
    }
    catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Failed to get user' });
    }
};
exports.getMe = getMe;
const checkUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User_1.User.findOne({ username: username.toLowerCase() });
        res.json({ available: !user });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to check username' });
    }
};
exports.checkUsername = checkUsername;
const generateUsername = async (req, res) => {
    try {
        const { displayName } = req.body;
        const base = displayName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const suggestions = [];
        for (let i = 0; i < 5; i++) {
            const suffix = Math.floor(Math.random() * 10000);
            const username = `${base}_${suffix}`;
            const exists = await User_1.User.findOne({ username });
            if (!exists) {
                suggestions.push(username);
            }
        }
        res.json({ suggestions });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to generate usernames' });
    }
};
exports.generateUsername = generateUsername;
//# sourceMappingURL=authController.js.map