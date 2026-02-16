import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

interface IUserDocument extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
            match: [/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'],
        },
        displayName: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            select: false,
        },
        avatar: {
            type: String,
            default: 'https://res.cloudinary.com/demo/image/upload/avatar-default.png',
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        role: {
            type: String,
            enum: ['user', 'developer', 'admin'],
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
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    if (this.password) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUserDocument>('User', userSchema);
