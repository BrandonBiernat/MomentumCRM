export type LoginRequest = {
  email: string
  password: string
  rememberMe?: boolean
}

export type RegisterRequest = {
  email: string
  password: string
  displayName: string
}

export type AuthResponse = {
  userId: string
  email: string
  displayName: string
  role: string
  token: string
  expiresAtUtc: string
}

export type AuthUser = {
  id: string
  email: string
  displayName: string
  role: string
  avatarUrl?: string
}

export type AuthCredentials = {
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
