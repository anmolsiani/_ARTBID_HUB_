import mongoose, { Schema, Document } from 'mongoose';
import { IComment } from '../types';

interface ICommentDocument extends IComment, Document { }

const commentSchema = new Schema<ICommentDocument>(
    {
        artworkId: {
            type: Schema.Types.ObjectId,
            ref: 'Artwork',
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
            maxlength: 500,
        },
        likes: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        parentCommentId: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
    },
    {
        timestamps: true,
    }
);

// Index for fetching comments
commentSchema.index({ artworkId: 1, createdAt: -1 });
commentSchema.index({ parentCommentId: 1 });

export const Comment = mongoose.model<ICommentDocument>('Comment', commentSchema);
