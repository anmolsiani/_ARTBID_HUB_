import mongoose, { Schema, Document } from 'mongoose';
import { IAuction } from '../types';

interface IAuctionDocument extends IAuction, Document { }

const auctionSchema = new Schema<IAuctionDocument>(
    {
        artworkId: {
            type: Schema.Types.ObjectId,
            ref: 'Artwork',
            required: true,
            unique: true,
        },
        startingBid: {
            type: Number,
            required: true,
            min: 0,
        },
        currentBid: {
            type: Number,
            required: true,
            min: 0,
        },
        highestBidder: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        bids: [{
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        }],
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'ended', 'cancelled'],
            default: 'pending',
        },
        winnerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Index for active auctions
auctionSchema.index({ status: 1, endDate: 1 });

export const Auction = mongoose.model<IAuctionDocument>('Auction', auctionSchema);
