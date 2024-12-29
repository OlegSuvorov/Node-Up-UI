import axios from 'axios'

const API_URL = 'http://localhost:3001/api/auth'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export interface LoginData {
    email: string
    password: string
}

export interface AuthResponse {
    user: {
        id: number
        email: string
    }
    token: string
}

export const authApi = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/login', data)
        return response.data
    },

    register: async (data: LoginData): Promise<{ message: string }> => {
        const response = await api.post('/register', data)
        return response.data
    },

    logout: () => {
        // Clear any auth tokens or state if needed
        localStorage.removeItem('user')
    }
} 