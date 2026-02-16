import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from '../types';

interface INotificationDocument extends INotification, Document { }

const notificationSchema = new Schema<INotificationDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['follow', 'like', 'comment', 'message', 'bid', 'blog_approved', 'payment'],
            required: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        entityId: {
            type: Schema.Types.ObjectId,
        },
        entityType: {
            type: String,
            enum: ['artwork', 'blog', 'comment', 'auction'],
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for fetching user notifications
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

export const Notification = mongoose.model<INotificationDocument>('Notification', notificationSchema);
