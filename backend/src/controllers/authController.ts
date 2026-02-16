import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../types';
import { z } from 'zod';

const signupSchema = z.object({
    body: z.object({
        email: z.string().email(),
        username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
        displayName: z.string().min(1),
        password: z.string().min(6),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

export const signup = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, username, displayName, password, role } = req.body;

        const existingUser = await User.findOne({
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

        const user = await User.create({
            email,
            username: username.toLowerCase(),
            displayName: displayName || username,
            password,
            ...(role && ['user', 'developer'].includes(role) ? { role } : {}),
        });

        const token = jwt.sign(
            {
                id: user._id.toString(),
                email: user.email,
                username: user.username,
                role: user.role,
            },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

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
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const token = jwt.sign(
            {
                id: user._id.toString(),
                email: user.email,
                username: user.username,
                role: user.role,
            },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

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
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({ user });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Failed to get user' });
    }
};

export const checkUsername = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username: username.toLowerCase() });
        res.json({ available: !user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to check username' });
    }
};

export const generateUsername = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { displayName } = req.body;
        const base = displayName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const suggestions: string[] = [];

        for (let i = 0; i < 5; i++) {
            const suffix = Math.floor(Math.random() * 10000);
            const username = `${base}_${suffix}`;
            const exists = await User.findOne({ username });
            if (!exists) {
                suggestions.push(username);
            }
        }

        res.json({ suggestions });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate usernames' });
    }
};
