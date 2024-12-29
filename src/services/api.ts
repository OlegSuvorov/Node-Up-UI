import axios from 'axios'

const API_URL = 'http://localhost:3001/api'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and user data if unauthorized
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            // Redirect to login page
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Auth types
export interface LoginData {
    email: string
    password: string
}

export interface RegisterData extends LoginData {
    firstName: string
    lastName: string
}

export interface AuthResponse {
    user: User
    token: string
}

// User types
export interface User {
    id: number
    email: string
    firstName: string
    lastName: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

// Auth API
export const authApi = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data)
        return response.data
    },

    register: async (data: RegisterData): Promise<{ message: string, user: User }> => {
        const response = await api.post('/auth/register', data)
        return response.data
    },

    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
}

// Users API
export const usersApi = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get('/users')
        return response.data
    },

    getById: async (id: number): Promise<User> => {
        const response = await api.get(`/users/${id}`)
        return response.data
    },

    update: async (id: number, data: Partial<User>): Promise<{ message: string }> => {
        const response = await api.put(`/users/${id}`, data)
        return response.data
    },

    delete: async (id: number): Promise<{ message: string }> => {
        const response = await api.delete(`/users/${id}`)
        return response.data
    }
} 