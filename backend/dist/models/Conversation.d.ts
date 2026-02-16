import mongoose, { Document } from 'mongoose';
import { IConversation } from '../types';
interface IConversationDocument extends IConversation, Document {
}
export declare const Conversation: mongoose.Model<IConversationDocument, {}, {}, {}, mongoose.Document<unknown, {}, IConversationDocument, {}, {}> & IConversationDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=Conversation.d.ts.map