import { create } from 'zustand';
import axios from 'axios';
import { socketService } from '../lib/socket';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const useChatStore = create((set, get) => ({
    conversations: [],
    groups: [],
    activeConversation: null,
    messages: [],
    loading: false,

    fetchConversations: async () => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/messages/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ conversations: response.data, loading: false });
        } catch (error) {
            console.error('Error fetching conversations:', error);
            set({ loading: false });
        }
    },

    fetchMessages: async (conversationId) => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/messages/${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({
                messages: response.data,
                activeConversation: conversationId,
                loading: false
            });

            // Join conversation room
            socketService.emit('join_conversation', conversationId);
        } catch (error) {
            console.error('Error fetching messages:', error);
            set({ loading: false });
        }
    },

    sendMessage: async (recipientId, text) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/messages/send`,
                { recipientId, text },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newMessage = response.data.message;

            // Emit via socket
            socketService.emit('send_message', {
                ...newMessage,
                recipientId
            });

            // Update local state if it's the active conversation
            if (get().activeConversation === response.data.conversationId) {
                set((state) => ({
                    messages: [...state.messages, newMessage]
                }));
            }

            // Refresh conversations list
            get().fetchConversations();

            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    addMessage: (message) => {
        const { activeConversation } = get();
        if (activeConversation === message.conversationId) {
            set((state) => ({
                messages: [...state.messages, message]
            }));
        }
        // Refresh conversations to update "last message"
        get().fetchConversations();
    },

    createGroup: async (groupData) => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/messages/group/create`, groupData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh conversations/groups
            get().fetchConversations();
            set({ loading: false });
            return response.data;
        } catch (error) {
            console.error('Error creating group:', error);
            set({ loading: false });
            throw error;
        }
    },

    setActiveConversation: (id) => set({ activeConversation: id }),
}));

export default useChatStore;
