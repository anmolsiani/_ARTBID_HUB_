import mongoose, { Schema, Document } from 'mongoose';
import { IConversation } from '../types';

interface IConversationDocument extends IConversation, Document { }

const conversationSchema = new Schema<IConversationDocument>(
    {
        participants: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }],
        lastMessage: {
            text: String,
            senderId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            timestamp: Date,
        },
        unreadCount: {
            type: Map,
            of: Number,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// Ensure only 2 participants
conversationSchema.pre('save', function (next) {
    if (this.participants.length !== 2) {
        throw new Error('A conversation must have exactly 2 participants');
    }
    next();
});

// Index for finding conversations
conversationSchema.index({ participants: 1 });

export const Conversation = mongoose.model<IConversationDocument>('Conversation', conversationSchema);
