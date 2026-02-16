import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://artbid-hubb.onrender.com';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
            toast.error('Session expired. Please login again.');
        } else if (error.response?.status === 403) {
            toast.error('You do not have permission to perform this action');
        } else if (error.response?.status === 404) {
            toast.error('Resource not found');
        } else if (error.response?.status >= 500) {
            toast.error('Server error. Please try again later.');
        } else {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

export const artAPI = {
    getAll: (params?: any) => api.get('/arts', { params }),
    getById: (id: string) => api.get(`/arts/${id}`),
    create: (data: any) => api.post('/arts', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id: string, data: any) => api.put(`/arts/${id}`, data),
    delete: (id: string) => api.delete(`/arts/${id}`),
    like: (id: string) => api.post(`/arts/${id}/like`),
    comment: (id: string, data: any) => api.post(`/arts/${id}/comment`, data),
};

export const userAPI = {
    getProfile: (username: string) => api.get(`/users/${username}`),
    updateProfile: (data: any) => api.put('/users/profile', data),
    follow: (userId: string) => api.post(`/users/${userId}/follow`),
    unfollow: (userId: string) => api.post(`/users/${userId}/unfollow`),
};

export const messageAPI = {
    getConversations: () => api.get('/messages/conversations'),
    getMessages: (userId: string) => api.get(`/messages/${userId}`),
    send: (data: any) => api.post('/messages', data),
};

export const aiAPI = {
    generate: (data: any) => api.post('/ai/generate', data),
};

export default api;
