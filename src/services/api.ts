import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
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
  getAll: async (
    params: PaginationParams,
  ): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
      },
    });
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
