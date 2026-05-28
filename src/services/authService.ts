import api from './api'
import { LoginCredentials, User } from '../types/auth'

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    // Step 1: get JWT
    const tokenRes = await api.post('/auth/api/v1/auth/login', credentials)
    const token: string = tokenRes.data.access_token

    // Store token before fetching /me so the interceptor can attach it
    localStorage.setItem('token', token)

    // Step 2: fetch current user profile
    const meRes = await api.get('/auth/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })

    const raw = meRes.data
    const user: User = {
      id: String(raw.id),
      username: raw.username,
      name: raw.username,
      email: raw.email,
      role: raw.role || 'student',
      createdAt: raw.created_at,
      updatedAt: raw.created_at,
    }

    return { user, token }
  },

  register: async (userData: {
    username: string
    email: string
    password: string
    is_superuser?: boolean
  }) => {
    const res = await api.post('/auth/api/v1/auth/register', userData)
    return res.data
  },

  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/api/v1/auth/me')
    const raw = res.data
    return {
      id: String(raw.id),
      username: raw.username,
      name: raw.username,
      email: raw.email,
      role: raw.role || 'student',
      createdAt: raw.created_at,
      updatedAt: raw.created_at,
    }
  },

  getUsers: async (): Promise<User[]> => {
    const res = await api.get('/auth/api/v1/auth/users')
    return res.data.map((raw: any) => ({
      id: String(raw.id),
      username: raw.username,
      name: raw.username,
      email: raw.email,
      role: raw.role || 'student',
      createdAt: raw.created_at,
      updatedAt: raw.created_at,
    }))
  },
}
