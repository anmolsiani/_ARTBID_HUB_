import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const getUserProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const followUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getFollowers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getFollowing: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map