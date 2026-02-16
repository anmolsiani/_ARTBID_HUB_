import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const signup: (req: AuthRequest, res: Response) => Promise<void>;
export declare const login: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMe: (req: AuthRequest, res: Response) => Promise<void>;
export declare const checkUsername: (req: AuthRequest, res: Response) => Promise<void>;
export declare const generateUsername: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map