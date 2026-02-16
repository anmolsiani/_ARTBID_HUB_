import mongoose, { Document } from 'mongoose';
import { IComment } from '../types';
interface ICommentDocument extends IComment, Document {
}
export declare const Comment: mongoose.Model<ICommentDocument, {}, {}, {}, mongoose.Document<unknown, {}, ICommentDocument, {}, {}> & ICommentDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=Comment.d.ts.map