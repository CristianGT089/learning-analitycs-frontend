export interface User {
  id: string
  username: string
  name?: string
  email: string
  role: 'admin' | 'teacher' | 'student' | 'ministry'
  institution?: string
  department?: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  isLoading: boolean
}