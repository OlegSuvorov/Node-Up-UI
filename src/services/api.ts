import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
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

// Add refresh token functionality
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

// Update the response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                .then(() => {
                    return api(originalRequest)
                })
                .catch(err => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                await api.post('/auth/refresh')
                processQueue(null)
                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                window.location.href = '/login'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
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

    logout: async () => {
        await api.post('/auth/logout')
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