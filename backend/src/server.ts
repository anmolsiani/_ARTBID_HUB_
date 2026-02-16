
// 1. Load environment variables at the VERY TOP
import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

// 2. Import Database Connection
import { connectDB } from './config/database';

// 3. Import Routes
import authRoutes from './routes/auth';

// Debug check for Environment Variables
console.log('--- Environment Check ---');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT}`);
console.log(`MONGODB_URI Loaded: ${process.env.MONGODB_URI ? 'Yes' : 'No'}`);
console.log('-------------------------');

const app: Express = express();
const server = http.createServer(app as any);
const PORT = process.env.PORT || 5000;

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(limiter as any);
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io Setup
const io = new Server(server as any, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    },
});

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
    });
});

// Routes
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Start Server & Connect Database
const startServer = async () => {
    // Attempt Database Connection
    await connectDB();

    server.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
};

startServer();
