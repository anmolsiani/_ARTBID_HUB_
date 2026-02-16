import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import artworkRoutes from './routes/artworks';
import messageRoutes from './routes/messages';
import { errorHandler, notFound } from './middleware/errorHandler';

export const createApp = (): Application => {
    const app = express();

    // Security middleware
    app.use(helmet());

    // CORS
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    }));

    // Body parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Logging
    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan('dev'));
    }

    // Health check
    app.get('/health', (_req: express.Request, res: express.Response) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/artworks', artworkRoutes);
    app.use('/api/messages', messageRoutes);

    // Error handling
    app.use(notFound);
    app.use(errorHandler);

    return app;
};
