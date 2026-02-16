import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://artbid-hubb.onrender.com';

let socket: Socket | null = null;

export const initSocket = (token: string) => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            auth: {
                token: token,
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket?.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    }
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const socketService = {
    initSocket,
    getSocket,
    disconnectSocket,
    on: (event: string, cb: (...args: any[]) => void) => socket?.on(event, cb),
    off: (event: string, cb?: (...args: any[]) => void) => socket?.off(event, cb),
    emit: (event: string, data: any) => socket?.emit(event, data),
};

export default socketService;
