export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  displayName: string
}

export interface AuthResponse {
  userId: string
  email: string
  displayName: string
  role: string
  token: string
  expiresAtUtc: string
}

export interface AuthUser {
  id: string
  email: string
  displayName: string
  role: string
}

export interface AuthCredentials {
  accessToken: string
  user: AuthUser
}

export const credentialsFromResponse = (res: AuthResponse): AuthCredentials => ({
  accessToken: res.token,
  user: {
    id: res.userId,
    email: res.email,
    displayName: res.displayName,
    role: res.role,
  },
})
