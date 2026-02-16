
import { Request } from 'express';

export interface UserPayload {
    id: string;
    email: string;
    username: string;
    role: 'user' | 'artist' | 'admin' | 'developer' | 'collector';
    [key: string]: any;
}

export interface AuthRequest extends Request {
    user?: UserPayload;
}
