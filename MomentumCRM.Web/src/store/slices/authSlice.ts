import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { AuthCredentials, AuthUser } from '../../services'

interface AuthState {
  accessToken: string | null
  user: AuthUser | null
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthCredentials>) => {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
    },
    clearCredentials: (state) => {
      state.accessToken = null
      state.user = null
    },
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export const authReducer = authSlice.reducer

export const selectAccessToken = (s: RootState) => s.auth.accessToken
export const selectAuthUser = (s: RootState) => s.auth.user
export const selectIsAuthenticated = (s: RootState) => s.auth.accessToken != null
