import mongoose, { Document } from 'mongoose';
import { IArtwork } from '../types';
interface IArtworkDocument extends IArtwork, Document {
}
export declare const Artwork: mongoose.Model<IArtworkDocument, {}, {}, {}, mongoose.Document<unknown, {}, IArtworkDocument, {}, {}> & IArtworkDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=Artwork.d.ts.map