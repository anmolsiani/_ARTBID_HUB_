import mongoose, { Schema, Document } from 'mongoose';
import { IArtwork } from '../types';

interface IArtworkDocument extends IArtwork, Document { }

const artworkSchema = new Schema<IArtworkDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['human', 'ai'],
            required: true,
        },
        title: {
            type: String,
            required: true,
            maxlength: 100,
            trim: true,
        },
        description: {
            type: String,
            maxlength: 2000,
        },
        images: [{
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        }],
        category: [{
            type: String,
            enum: ['AI/ML', 'Abstract', 'Portrait', 'Landscape', 'Digital', 'Traditional', 'Photography', 'Other'],
        }],
        price: {
            type: Number,
            min: 0,
        },
        forSale: {
            type: Boolean,
            default: false,
        },
        likes: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }],
        views: {
            type: Number,
            default: 0,
        },
        saves: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
    },
    {
        timestamps: true,
    }
);

// Indexes for performance
artworkSchema.index({ userId: 1, createdAt: -1 });
artworkSchema.index({ type: 1 });
artworkSchema.index({ category: 1 });
artworkSchema.index({ forSale: 1 });
artworkSchema.index({ createdAt: -1 });

export const Artwork = mongoose.model<IArtworkDocument>('Artwork', artworkSchema);
