
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    username: string;
    displayName: string;
    password?: string;
    avatar?: string;
    role: 'user' | 'artist' | 'admin' | 'developer' | 'collector';
    bio?: string;
    socialLinks?: {
        twitter?: string;
        instagram?: string;
        portfolio?: string;
    };
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    isVerified: boolean;
    googleId?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        lowercase: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [20, 'Username cannot exceed 20 characters'],
        match: [/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'],
    },
    displayName: {
        type: String,
        required: [true, 'Please provide a display name'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/demo/image/upload/avatar-default.png',
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    role: {
        type: String,
        enum: ['user', 'artist', 'admin', 'developer', 'collector'],
        default: 'user',
    },
    socialLinks: {
        twitter: String,
        instagram: String,
        portfolio: String,
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    isVerified: {
        type: Boolean,
        default: false,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
}, {
    timestamps: true,
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
