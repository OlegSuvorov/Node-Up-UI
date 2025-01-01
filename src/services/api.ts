import axios, { AxiosError } from 'axios';
import { refreshTokenHandler } from './auth/refreshToken';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Update the response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (refreshTokenHandler.isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshTokenHandler.failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      refreshTokenHandler.isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        refreshTokenHandler.processQueue(null);
        return api(originalRequest);
      } catch (refreshError: unknown) {
        const axiosError = refreshError as AxiosError;
        refreshTokenHandler.processQueue(axiosError);
        if (axiosError.response?.status === 401) {
          window.location.href = '/login';
        }
        return Promise.reject(axiosError);
      } finally {
        refreshTokenHandler.isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// Auth types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
}

// User types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth API
export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  verify: async (): Promise<AuthResponse> => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  register: async (
    data: RegisterData,
  ): Promise<{ message: string; user: User }> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<User>,
  ): Promise<{ message: string }> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
