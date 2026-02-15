import { Request } from 'express';
import { Types } from 'mongoose';

export interface IUser {
    _id: Types.ObjectId;
    email: string;
    username: string;
    displayName: string;
    password?: string;
    avatar?: string;
    bio?: string;
    role: 'user' | 'developer' | 'admin';
    socialLinks?: {
        twitter?: string;
        instagram?: string;
        portfolio?: string;
    };
    followers: Types.ObjectId[];
    following: Types.ObjectId[];
    isVerified: boolean;
    googleId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IArtwork {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    type: 'human' | 'ai';
    title: string;
    description?: string;
    images: Array<{
        url: string;
        publicId: string;
    }>;
    category: string[];
    price?: number;
    forSale: boolean;
    likes: Types.ObjectId[];
    comments: Types.ObjectId[];
    views: number;
    saves: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IComment {
    _id: Types.ObjectId;
    artworkId: Types.ObjectId;
    userId: Types.ObjectId;
    text: string;
    likes: Types.ObjectId[];
    parentCommentId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface IConversation {
    _id: Types.ObjectId;
    participants: Types.ObjectId[];
    lastMessage?: {
        text: string;
        senderId: Types.ObjectId;
        timestamp: Date;
    };
    unreadCount: Map<string, number>;
    createdAt: Date;
    updatedAt: Date;
}

export interface IMessage {
    _id: Types.ObjectId;
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    text: string;
    images?: string[];
    readBy: Types.ObjectId[];
    replyTo?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAuction {
    _id: Types.ObjectId;
    artworkId: Types.ObjectId;
    startingBid: number;
    currentBid: number;
    highestBidder?: Types.ObjectId;
    bids: Array<{
        userId: Types.ObjectId;
        amount: number;
        timestamp: Date;
    }>;
    startDate: Date;
    endDate: Date;
    status: 'pending' | 'active' | 'ended' | 'cancelled';
    winnerId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBlog {
    _id: Types.ObjectId;
    authorId: Types.ObjectId;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    category: string[];
    readTime: number;
    likes: Types.ObjectId[];
    comments: Types.ObjectId[];
    status: 'draft' | 'pending' | 'published' | 'rejected';
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface INotification {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    type: 'follow' | 'like' | 'comment' | 'message' | 'bid' | 'blog_approved' | 'payment';
    senderId?: Types.ObjectId;
    entityId?: Types.ObjectId;
    entityType?: 'artwork' | 'blog' | 'comment' | 'auction';
    message: string;
    read: boolean;
    createdAt: Date;
}

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        username: string;
        role: 'user' | 'developer' | 'admin';
    };
}

export interface SocketUser {
    userId: string;
    socketId: string;
}
