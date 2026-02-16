import mongoose, { Document } from 'mongoose';
import { IBlog } from '../types';
interface IBlogDocument extends IBlog, Document {
}
export declare const Blog: mongoose.Model<IBlogDocument, {}, {}, {}, mongoose.Document<unknown, {}, IBlogDocument, {}, {}> & IBlogDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=Blog.d.ts.map