export interface User {
    _id: string;
    email: string;
    username: string;
    displayName: string;
    avatar?: string;
    bio?: string;
    role: 'user' | 'developer' | 'admin';
    socialLinks?: {
        twitter?: string;
        instagram?: string;
        portfolio?: string;
    };
    followers: string[];
    following: string[];
    isVerified: boolean;
    createdAt: string;
}

export interface Artwork {
    _id: string;
    userId: User;
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
    likes: string[];
    comments: Comment[];
    views: number;
    saves: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    _id: string;
    artworkId: string;
    userId: User;
    text: string;
    likes: string[];
    parentCommentId?: string;
    createdAt: string;
}

export interface Conversation {
    _id: string;
    participants: User[];
    lastMessage?: {
        text: string;
        senderId: string;
        timestamp: string;
    };
    unreadCount: Record<string, number>;
    createdAt: string;
}

export interface Message {
    _id: string;
    conversationId: string;
    senderId: User;
    text: string;
    images?: string[];
    readBy: string[];
    replyTo?: string;
    createdAt: string;
}

export interface Auction {
    _id: string;
    artworkId: Artwork;
    startingBid: number;
    currentBid: number;
    highestBidder?: User;
    bids: Array<{
        userId: string;
        amount: number;
        timestamp: string;
    }>;
    startDate: string;
    endDate: string;
    status: 'pending' | 'active' | 'ended' | 'cancelled';
    winnerId?: string;
}

export interface Blog {
    _id: string;
    authorId: User;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    category: string[];
    readTime: number;
    likes: string[];
    comments: Comment[];
    status: 'draft' | 'pending' | 'published' | 'rejected';
    publishedAt?: string;
    createdAt: string;
}

export interface Notification {
    _id: string;
    userId: string;
    type: 'follow' | 'like' | 'comment' | 'message' | 'bid' | 'blog_approved' | 'payment';
    senderId?: User;
    entityId?: string;
    entityType?: 'artwork' | 'blog' | 'comment' | 'auction';
    message: string;
    read: boolean;
    createdAt: string;
}
