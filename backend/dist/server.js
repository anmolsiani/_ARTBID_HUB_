"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const database_1 = require("./config/database");
const app_1 = require("./app");
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, database_1.connectDB)();
        // Create Express app
        const app = (0, app_1.createApp)();
        // Create HTTP server
        const server = http_1.default.createServer(app);
        // Initialize Socket.IO
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:3000',
                credentials: true,
            },
        });
        // Socket.IO connection handling
        io.on('connection', (socket) => {
            console.log(`✅ Client connected: ${socket.id}`);
            socket.on('disconnect', () => {
                console.log(`❌ Client disconnected: ${socket.id}`);
            });
            // Handle user authentication
            socket.on('authenticate', (userId) => {
                socket.join(`user:${userId}`);
                socket.broadcast.emit('user_online', { userId, status: 'online' });
            });
            // Handle messaging
            socket.on('send_message', async (data) => {
                // Emit to recipient
                io.to(`user:${data.recipientId}`).emit('new_message', data);
            });
            socket.on('typing', (data) => {
                io.to(`conversation:${data.conversationId}`).emit('user_typing', {
                    userId: data.userId,
                    isTyping: data.isTyping,
                });
            });
            // Handle notifications
            socket.on('notification', (data) => {
                io.to(`user:${data.userId}`).emit('new_notification', data);
            });
        });
        // Start server
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 Socket.IO initialized`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
            });
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map