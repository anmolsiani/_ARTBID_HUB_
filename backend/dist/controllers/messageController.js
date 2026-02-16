"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = exports.getConversations = void 0;
const Conversation_1 = require("../models/Conversation");
const Message_1 = require("../models/Message");
const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await Conversation_1.Conversation.find({
            participants: userId
        })
            .populate('participants', 'username profileImage')
            .sort({ updatedAt: -1 });
        return res.json(conversations);
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getConversations = getConversations;
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;
        // Verify user is participant
        const conversation = await Conversation_1.Conversation.findOne({
            _id: conversationId,
            participants: userId
        });
        if (!conversation) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const messages = await Message_1.Message.find({ conversationId })
            .populate('senderId', 'username profileImage')
            .sort({ createdAt: 1 });
        return res.json(messages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMessages = getMessages;
const sendMessage = async (req, res) => {
    try {
        const { recipientId, text } = req.body;
        const senderId = req.user.id;
        if (!recipientId || !text) {
            return res.status(400).json({ message: 'Recipient and text are required' });
        }
        // Find or create conversation
        let conversation = await Conversation_1.Conversation.findOne({
            participants: { $all: [senderId, recipientId] }
        });
        if (!conversation) {
            conversation = new Conversation_1.Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text,
                    senderId,
                    timestamp: new Date()
                }
            });
        }
        else {
            conversation.lastMessage = {
                text,
                senderId,
                timestamp: new Date()
            };
        }
        await conversation.save();
        const message = new Message_1.Message({
            conversationId: conversation._id,
            senderId,
            text,
        });
        await message.save();
        return res.status(201).json({ message, conversationId: conversation._id });
    }
    catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.sendMessage = sendMessage;
//# sourceMappingURL=messageController.js.map