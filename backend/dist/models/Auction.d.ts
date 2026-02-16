import mongoose, { Document } from 'mongoose';
import { IAuction } from '../types';
interface IAuctionDocument extends IAuction, Document {
}
export declare const Auction: mongoose.Model<IAuctionDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAuctionDocument, {}, {}> & IAuctionDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=Auction.d.ts.map