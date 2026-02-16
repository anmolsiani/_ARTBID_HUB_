
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.jwt) { // Check for token in cookies as well, just in case
            token = req.cookies.jwt;
        }

        if (!token) {
            res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as UserPayload;

        // Attach user to request
        (req as any).user = decoded;

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
