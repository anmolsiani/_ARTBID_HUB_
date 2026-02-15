import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketService {
    private socket: Socket | null = null;

    connect(userId: string): Socket {
        if (!this.socket) {
            this.socket = io(SOCKET_URL, {
                transports: ['websocket'],
                autoConnect: true,
            });

            this.socket.on('connect', () => {
                console.log('✅ Socket connected');
                this.socket?.emit('authenticate', userId);
            });

            this.socket.on('disconnect', () => {
                console.log('❌ Socket disconnected');
            });

            this.socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        }

        return this.socket;
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }

    emit(event: string, data: any): void {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    on(event: string, callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event: string): void {
        if (this.socket) {
            this.socket.off(event);
        }
    }
}

export const socketService = new SocketService();
