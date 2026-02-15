import mongoose, { Schema, Document } from 'mongoose';
import { IBlog } from '../types';

interface IBlogDocument extends IBlog, Document { }

const blogSchema = new Schema<IBlogDocument>(
    {
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            maxlength: 200,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        content: {
            type: String,
            required: true,
        },
        excerpt: {
            type: String,
            maxlength: 300,
        },
        coverImage: {
            type: String,
        },
        category: [{
            type: String,
            enum: ['AI/ML', 'Web Dev', 'Mobile', 'Design', 'DevOps', 'Other'],
        }],
        readTime: {
            type: Number,
            required: true,
        },
        likes: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }],
        status: {
            type: String,
            enum: ['draft', 'pending', 'published', 'rejected'],
            default: 'draft',
        },
        publishedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ authorId: 1 });

export const Blog = mongoose.model<IBlogDocument>('Blog', blogSchema);
