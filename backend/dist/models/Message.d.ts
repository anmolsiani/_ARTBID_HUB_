import mongoose, { Document } from 'mongoose';
import { IMessage } from '../types';
interface IMessageDocument extends IMessage, Document {
}
export declare const Message: mongoose.Model<IMessageDocument, {}, {}, {}, mongoose.Document<unknown, {}, IMessageDocument, {}, {}> & IMessageDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=Message.d.ts.map