import mongoose, { Schema, Document } from 'mongoose';
import { IMessage } from '../types';

interface IMessageDocument extends IMessage, Document { }

const messageSchema = new Schema<IMessageDocument>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
            index: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
            maxlength: 2000,
        },
        images: [{
            type: String,
        }],
        readBy: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        replyTo: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
        },
    },
    {
        timestamps: true,
    }
);

// Index for fetching messages
messageSchema.index({ conversationId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessageDocument>('Message', messageSchema);
