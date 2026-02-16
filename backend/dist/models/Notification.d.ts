import mongoose, { Document } from 'mongoose';
import { INotification } from '../types';
interface INotificationDocument extends INotification, Document {
}
export declare const Notification: mongoose.Model<INotificationDocument, {}, {}, {}, mongoose.Document<unknown, {}, INotificationDocument, {}, {}> & INotificationDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=Notification.d.ts.map