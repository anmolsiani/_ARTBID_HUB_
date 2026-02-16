import { Request, Response } from 'express';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';

export const getConversations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const conversations = await Conversation.find({
            participants: userId
        })
            .populate('participants', 'username profileImage')
            .sort({ updatedAt: -1 });

        return res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;
        const userId = (req as any).user.id;

        // Verify user is participant
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId
        });

        if (!conversation) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const messages = await Message.find({ conversationId })
            .populate('senderId', 'username profileImage')
            .sort({ createdAt: 1 });

        return res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { recipientId, text } = req.body;
        const senderId = (req as any).user.id;

        if (!recipientId || !text) {
            return res.status(400).json({ message: 'Recipient and text are required' });
        }

        // Find or create conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text,
                    senderId,
                    timestamp: new Date()
                }
            });
        } else {
            conversation.lastMessage = {
                text,
                senderId,
                timestamp: new Date()
            };
        }

        await conversation.save();

        const message = new Message({
            conversationId: conversation._id,
            senderId,
            text,
        });

        await message.save();

        return res.status(201).json({ message, conversationId: conversation._id });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
