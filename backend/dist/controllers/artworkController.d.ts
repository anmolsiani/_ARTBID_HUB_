import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const createArtwork: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getArtworks: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getArtworkById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateArtwork: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteArtwork: (req: AuthRequest, res: Response) => Promise<void>;
export declare const likeArtwork: (req: AuthRequest, res: Response) => Promise<void>;
export declare const saveArtwork: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSavedArtworks: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getReelsFeed: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=artworkController.d.ts.map