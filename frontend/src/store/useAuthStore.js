import { create } from 'zustand';
import { authAPI } from '@/lib/api';
import { initSocket, disconnectSocket } from '@/lib/socket';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,

    // Initialize auth from localStorage
    initialize: () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            if (token && user) {
                try {
                    // Update cookie for middleware if it's missing or different
                    document.cookie = `token=${token}; path=/; max-age=2592000; SameSite=Lax`;

                    set({
                        token,
                        user: JSON.parse(user),
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    // Initialize socket connection
                    initSocket(token);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    set({ isLoading: false });
                }
            } else {
                set({ isLoading: false });
            }
        }
    },

    // Login
    login: async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { token, user } = response.data;

            // Store in localStorage & Cookie
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            document.cookie = `token=${token}; path=/; max-age=2592000; SameSite=Lax`;

            // Update state
            set({
                token,
                user,
                isAuthenticated: true,
            });

            // Initialize socket
            initSocket(token);

            toast.success(`Welcome back, ${user.username}!`);
            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, error: message };
        }
    },

    // Register
    register: async (data) => {
        try {
            const response = await authAPI.register(data);
            const { token, user } = response.data;

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Update state
            set({
                token,
                user,
                isAuthenticated: true,
            });

            // Initialize socket
            initSocket(token);

            toast.success(`Welcome to ArtBid Hub, ${user.username}!`);
            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, error: message };
        }
    },

    // Logout
    logout: () => {
        // Clear localStorage & Cookie
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        // Disconnect socket
        disconnectSocket();

        // Clear state
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });

        toast.success('Logged out successfully');

        // Redirect to home
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    },

    // Check authentication
    checkAuth: async () => {
        const { token } = get();
        if (!token) {
            set({ isLoading: false });
            return false;
        }

        try {
            const response = await authAPI.getMe();
            const user = response.data;

            localStorage.setItem('user', JSON.stringify(user));
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            // Token invalid, clear everything
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
            return false;
        }
    },

    // Update user profile
    updateUser: (userData) => {
        const updatedUser = { ...get().user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
    },
}));

export default useAuthStore;
